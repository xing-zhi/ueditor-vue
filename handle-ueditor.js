const path = require('path');
const fs = require('fs');

const pathResolve = (p) => path.resolve(__dirname, p);

function handleConfig(req, res) {
  res.sendFile(pathResolve('public/ueditor/config.json'));
}

function handleUploadFile(req, res) {
  req.pipe(req.busboy);
  req.busboy.on('file', (fieldName, file, filename) => {
    const filePath = pathResolve(`public/upload/ueditor/${filename}`);
    const fileUrl = `/upload/ueditor/${filename}`;
    const fsStream = fs.createWriteStream(filePath);

    file.pipe(fsStream);
    fsStream.on('close', () => {
      res.json({
        url: fileUrl,
        state: "SUCCESS"
      });
    });
  });
};

const handlerMap = new Map()
        .set('config', handleConfig)
        .set('uploadimage', handleUploadFile)
        .set('uploadscrawl', handleUploadFile)
        .set('uploadvideo', handleUploadFile)
        .set('uploadfile', handleUploadFile);

module.exports = function(req, res) {
  const query = req.query;
  const action = query.action;
  const handler = handlerMap.get(action);

  if ( typeof handler === 'function' ) {
    handler(req, res);
  } else {
    res.status(404).send('Not Found');
  }
};
