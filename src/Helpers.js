export const HTML_MIME = 'text/html';
export const XML_MIME = 'application/xml';
export const CSS_MIME = 'text/css';
export const JS_MIME = 'application/js';

export function isHTMLString (str) {
	var doc = new window.DOMParser().parseFromString(str, HTML_MIME);
	let isHTML = Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
	return isHTML;
}
