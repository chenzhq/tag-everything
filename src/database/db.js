const Datastore = require('nedb');
const db = {};
/* eslint-disable */
console.log('db.js');
/* eslint-enable */
db.files = new Datastore({
    filename: 'files.data',
    autoload: true,
    timestampData: true,
    onload() {
        /* eslint-disable */
        console.log('onload db.files');
        /* eslint-enable */
        db.files.ensureIndex({ fieldName: 'path', unique: true }, () => {
            /* eslint-disable */
            console.log('db.files 创建索引');
            /* eslint-enable */
        });
    },
});
db.tags = new Datastore({
    filename: 'tags.data',
    autoload: true,
    timestampData: true,
    onload() {
        db.tags.ensureIndex({ fieldName: 'name', unique: true }, () => {
            /* eslint-disable */
            console.log('db.tags 创建索引');
            /* eslint-enable */
        });
    },
});

export const getFiles = (page = { skip: 0, limit: 30 }, filter = {}) =>
    new Promise((resolve, reject) => {
        const filterCondition = {};
        if (filter.tags && filter.tags.length > 0) {
            filterCondition['$where'] = function() {
                return filter.tags.every((tag) => this.tags.includes(tag));
            };
        }

        db.files
            .find(filterCondition)
            .skip(page.skip)
            .limit(page.limit)
            .sort({ tags: -1 })
            .exec((err, docs) => {
                if (err) return reject(err);
                db.files.count({}, (err, count) => {
                    if (err) return reject(err);
                    /* eslint-disable */
                    console.groupCollapsed('查询files成功');
                    console.table(docs);
                    console.groupEnd();
                    /* eslint-enable */

                    return resolve({ docs, count });
                });
            });
    });
export const getTags = () =>
    new Promise((resolve, reject) => {
        db.tags.find({}, (err, tags) => {
            if (err) return reject(err);
            /* eslint-disable */
            console.groupCollapsed('查询tags成功');
            console.table(tags);
            console.groupEnd();
            /* eslint-enable */
            return resolve(tags);
        });
    });
export const insertFiles = (files) =>
    new Promise((resolve, reject) => {
        if (files.length === 0) return resolve([]);
        const paths = files.map((file) => file.path);
        db.files.count({ path: { $in: paths } }, (err, count) => {
            if (err) return reject(err);
            if (count === 0) {
                db.files.insert(files, (err, insertedFiles) => {
                    if (err) {
                        return reject(err);
                    }
                    /* eslint-disable */
                    console.groupCollapsed('插入file成功，全部');
                    console.table(insertedFiles);
                    console.groupEnd();
                    /* eslint-enable */

                    return resolve(insertedFiles);
                });
            } else if (count === files.length) {
                return reject('文件已存在');
            } else {
                db.files.find({ path: { $in: paths } }, (err, existedFiles) => {
                    const existedFilePaths = existedFiles.map((f) => f.path);
                    const newFiles = files.filter((file) => !existedFilePaths.includes(file.path));
                    db.files.insert(newFiles, (err, insertedFiles) => {
                        if (err) {
                            return reject(err);
                        }
                        /* eslint-disable */
                        console.groupCollapsed('插入file成功， 部分');
                        console.table(insertedFiles);
                        console.groupEnd();
                        /* eslint-enable */

                        return resolve(insertedFiles);
                    });
                });
            }
        });
    });

export const insertTag = (name) =>
    new Promise((resolve, reject) => {
        db.tags.insert({ name }, (err, tag) => {
            if (err) {
                return reject(err);
            }
            /* eslint-disable */
            console.groupCollapsed('插入tag成功');
            console.table(tag);
            console.groupEnd();
            /* eslint-enable */
            return resolve(tag);
        });
    });

export const insertTags = (tags) =>
    new Promise((resolve, reject) => {
        if (tags.length === 0) return resolve([]);
        const names = tags.map((tag) => tag.name);
        db.tags.count({ name: { $in: names } }, (err, count) => {
            if (err) return reject(err);
            if (count === 0) {
                db.tags.insert(tags, (err, insertedTags) => {
                    if (err) {
                        return reject(err);
                    }
                    /* eslint-disable */
                    console.groupCollapsed('插入tag成功，全部');
                    console.table(insertedTags);
                    console.groupEnd();
                    /* eslint-enable */

                    return resolve(insertedTags);
                });
            } else if (count === tags.length) {
                return resolve([]);
            } else {
                db.tags.find({ name: { $in: names } }, (err, insertedTags) => {
                    const existedTagNames = insertedTags.map((f) => f.name);
                    const newTags = tags.filter((tag) => !existedTagNames.includes(tag.name));
                    db.tags.insert(newTags, (err, insertedTags) => {
                        /* eslint-disable */
                        console.log(err, insertedTags);
                        /* eslint-enable */

                        if (err) {
                            return reject(err);
                        }
                        /* eslint-disable */
                        console.groupCollapsed('插入tag成功， 部分');
                        console.table(insertedTags);
                        console.groupEnd();
                        /* eslint-enable */

                        return resolve(insertedTags);
                    });
                });
            }
        });
    });

export const updateTag = (tagName, increment) =>
    new Promise((resolve, reject) => {
        db.tags.update(
            { name: tagName },
            { $inc: { count: increment } },
            {},
            (err, numReplaced) => {
                if (err) reject(err);
                /* eslint-disable */
                console.groupCollapsed('更新tag成功');
                console.log('更新数量：', numReplaced);
                console.groupEnd();
                /* eslint-enable */
                resolve(numReplaced);
            }
        );
    });

export const deleteFilesByIds = (ids) =>
    new Promise((resolve, reject) => {
        db.files.remove({ _id: { $in: ids } }, { multi: true }, (err, numRemoved) => {
            if (err) return reject(err);
            /* eslint-disable */
            console.groupCollapsed('删除files成功');
            console.log('删除数量 ', numRemoved);
            console.groupEnd();
            /* eslint-enable */

            return resolve(numRemoved);
        });
    });

export const updateFiles = (ids, tags) =>
    new Promise((resolve, reject) => {
        db.files.update(
            { _id: { $in: ids } },
            { $addToSet: { tags: { $each: tags } } },
            { multi: true },
            (err, num) => {
                if (err) return reject(err);
                /* eslint-disable */
                console.groupCollapsed('更新files成功');
                console.log('更新数量', num);
                console.groupEnd();
                /* eslint-enable */
                return resolve(num);
            }
        );
    });
