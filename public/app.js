'use strict';

/* global document FormData XMLHttpRequest */

import filesize from '/js/filesize.esm.js';

const form = document.querySelector('form');
const progress = document.querySelector('progress');
const submit = form.querySelector('input[type="submit"]');
const result = document.querySelector('p');

const click = e => {
	e.preventDefault();

	e.target.disabled = true;

	const fd = new FormData(form);

	const req = new XMLHttpRequest();
	req.upload.addEventListener('progress', ({ loaded, total }) => {
		progress.setAttribute('value', loaded);
		progress.setAttribute('max', total);
		result.textContent = filesize(loaded) + ' / ' + filesize(total);
	});
	req.addEventListener('load', () => {
		const data = JSON.parse(req.responseText);
		if (data.ok) {
			result.textContent = result.textContent + ' - OK';
		} else {
			result.textContent = data.error;
		}
		e.target.disabled = false;
	});
	req.open('POST', '/');
	req.send(fd);

	return false;
};

submit.addEventListener('click', click);
