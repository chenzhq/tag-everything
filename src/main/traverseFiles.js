const fs = require('fs');
const path = require('path');
import { ipcMain, dialog } from 'electron';

export function walk(dir, done, oneDone, judge) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                oneDone && oneDone(file);
                if (stat && stat.isDirectory()) {
                    walk(
                        file,
                        function(err, res) {
                            if (err) done(err);
                            results = results.concat(res);
                            if (results.length > 10000) done(new Error('文件太多'));
                            if (!--pending) done(null, results);
                        },
                        oneDone,
                        judge
                    );
                } else {
                    if (judge && !judge(file, stat)) return;
                    results.push({
                        filePath: file,
                        size: stat.size,
                        createTime: new Date(stat.birthtime).getTime(),
                    });
                    if (results.length > 10000) done(new Error('文件太多'));
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

export function walkFiles(filePaths, done) {
    const results = [];
    filePaths.forEach((file) => {
        fs.stat(file, (err, stat) => {
            if (err) return done(err);
            results.push({
                filePath: file,
                size: stat.size,
                createTime: new Date(stat.birthtime).getTime(),
            });
            if (results.length === filePaths.length) {
                done(null, results);
            }
        });
    });
}

ipcMain.on('open-dialog', (event, { type, extFilter }) => {
    const option = {};
    if (type === 'dir') {
        option.properties = ['openDirectory', 'multiSelections'];
    } else if (type === 'file') {
        option.properties = ['openFile', 'multiSelections'];
        // if (isMulti) {
        //     option.properties.push('multiSelections');
        // }
    } else if (type === 'traverseFile') {
        option.properties = ['openDirectory'];
    }

    dialog.showOpenDialog(option, (dir) => {
        if (dir && type === 'traverseFile') {
            walk(
                dir[0],
                (err, files) => {
                    if (err) {
                        event.sender.send('error', err.message);
                    }
                    const insertList = files.map(({ filePath, size, createTime }) => {
                        const { base, ext } = path.parse(filePath);
                        return {
                            path,
                            name: base,
                            ext: ext ? ext : '--',
                            size,
                            tags: [],
                            createTime,
                        };
                    });
                    event.sender.send('done', insertList);
                },
                undefined,
                (filePath) => {
                    if (!extFilter || extFilter.length === 0) return true;
                    const extName = path.extname(filePath);
                    return extFilter.includes(extName);
                }
            );
        } else if (dir && type === 'file') {
            walkFiles(dir, (err, files) => {
                const insertList = files.map(({ filePath, size, createTime }) => {
                    const { base, ext } = path.parse(filePath);
                    const _ext = ext.substr(1);
                    return {
                        path: filePath,
                        name: base,
                        ext: _ext ? _ext : '--',
                        size,
                        tags: [],
                        createTime,
                    };
                });
                event.sender.send('done', insertList);
            });
        } else if (dir && type === 'dir') {
            walkFiles(dir, (err, files) => {
                const insertList = files.map(({ filePath, size, createTime }) => {
                    const { base } = path.parse(filePath);
                    return { path: filePath, name: base, ext: 'dir', size, tags: [], createTime };
                });
                event.sender.send('done', insertList);
            });
        }
    });
});
