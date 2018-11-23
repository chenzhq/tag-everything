const image = [
    'jpg',
    'png',
    'gif',
    'webp',
    'flif',
    'cr2',
    'tif',
    'bmp',
    'jxr',
    'psd',
    'ico',
    'cur',
    'bpg',
    'jp2',
    'jpm',
    'mj2',
    'heic',
    'ktx',
];

const video = [
    'mp4',
    'mkv',
    'webm',
    'mov',
    'avi',
    'mpg',
    '3gp',
    'ogv',
    'ogm',
    'swf',
    'flv',
    'mpeg',
    'mpg',
    'dat',
    'rmvb',
    'rm',
    'ra',
    'mov',
    'qt',
    'asf',
];

const zip = ['xpi', 'odt', 'ods', 'odp', 'zip', 'tar', 'rar', 'gz', 'bz2', '7z'];

const doc = ['docx', 'pptx', 'xlsx', 'pdf', 'xml', 'mobi', 'epub'];

const audio = [
    'mid',
    'wav',
    'qcp',
    'wma',
    'wmv',
    'mp3',
    'mp2',
    'm4a',
    'apus',
    'oga',
    'spx',
    'ogg',
    'ogx',
    'flac',
    'ape',
    'wv',
    'amr',
    'aif',
    'mpc',
];

const app = ['exe', 'dmg'];

const font = ['woff', 'woff2', 'eot', 'ttf', 'otf'];

const all = {};
image.reduce((p, c) => {
    p[c] = 'image';
    return p;
}, all);

video.reduce((p, c) => {
    p[c] = 'video';
    return p;
}, all);

doc.reduce((p, c) => {
    p[c] = 'doc';
    return p;
}, all);

audio.reduce((p, c) => {
    p[c] = 'audio';
    return p;
}, all);

app.reduce((p, c) => {
    p[c] = 'app';
    return p;
}, all);

font.reduce((p, c) => {
    p[c] = 'font';
    return p;
}, all);

zip.reduce((p, c) => {
    p[c] = 'zip';
    return p;
}, all);

export { image, video, doc, audio, app, font, zip, all };
