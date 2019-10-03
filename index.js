'use strict';

const { join } = require('path');
const { createWriteStream } = require('fs');

const express = require('express');
const busboy = require('connect-busboy');


const app = express();

app.post('/', busboy({ immediate: true }), (req, res) =>
	req.busboy
		.on('file', (fieldname, file, filename, encoding, mimetype) => {
			console.log(fieldname, filename, encoding, mimetype);
			file.pipe(createWriteStream(join('Files', filename)));
		})
		.once('finish', () =>
			res.json({ ok: true })));

app.use(express.static('public'));
app.use('/js', express.static('node_modules/filesize/lib'));

const [ port = 8082, host = '0.0.0.0' ] = process.argv.slice(2);

app.listen(port, host, err =>
	err
		? console.error(err)
		: console.log('Listening on ' + host + ':' + port));
