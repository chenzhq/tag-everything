const fs = require('fs');
const path = require('path');
import { ipcMain, dialog } from 'electron';

export function walk(dir, done, oneDone) {
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
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        },
                        oneDone
                    );
                } else {
                    results.push({
                        path: file,
                        size: stat.size,
                        createTime: new Date(stat.birthtime).getTime(),
                    });
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
                path: file,
                size: stat.size,
                createTime: new Date(stat.birthtime).getTime(),
            });
            if (results.length === filePaths.length) {
                done(null, results);
            }
        });
    });
}

ipcMain.on('open-dialog', (event, { type, isMulti, extFilter }) => {
    const option = {};
    if (type === 'dir') {
        option.properties = ['openDirectory'];
    } else if (type === 'file') {
        option.properties = ['openFile'];
        if (isMulti) {
            option.properties.push('multiSelections');
        }
    }

    dialog.showOpenDialog(option, (dir) => {
        if (dir && type === 'dir') {
            walk(
                dir[0],
                (err, files) => {
                    const updateTime = Date.now();
                    if (extFilter) {
                        files = files.filter(({ path }) =>
                            extFilter.includes(path.substr(path.lastIndexOf('.') + 1))
                        );
                    }
                    const insertList = files.map(({ path, size, createTime }) => {
                        // 部分文件没有后缀名
                        const pi = path.lastIndexOf('.');
                        const li = path.lastIndexOf('/');
                        let ext;
                        if (pi === -1 || pi < li) {
                            ext = '--';
                        } else {
                            ext = path.substr(pi + 1);
                        }
                        return {
                            path,
                            name: path.substr(li + 1),
                            ext,
                            size,
                            tags: [],
                            createTime,
                            updateTime,
                        };
                    });
                    event.sender.send('done', insertList);
                },
                (file) => {
                    /* eslint-disable */
                    // console.log('one file done', file);
                    /* eslint-enable */
                }
            );
        } else if (dir && type === 'file') {
            walkFiles(dir, (err, files) => {
                const updateTime = Date.now();
                if (extFilter) {
                    files = files.filter(({ path }) =>
                        extFilter.includes(path.substr(path.lastIndexOf('.') + 1))
                    );
                }
                const insertList = files.map(({ path, size, createTime }) => {
                    return {
                        path,
                        name: path.substr(path.lastIndexOf('/') + 1),
                        ext: path.substr(path.lastIndexOf('.') + 1),
                        size,
                        tags: [],
                        createTime,
                        updateTime,
                    };
                });
                event.sender.send('done', insertList);
            });
        }
    });
});
