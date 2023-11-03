import sanitizeHtml from 'sanitize-html';

export function sanitizeMd(html: string): string {
	return sanitizeHtml(html, {
		transformTags: {
			a: (tagName, attribs) => ({
				tagName,
				attribs: {
					...attribs,
					href: attribs['href']?.replace(/^https?:\/\/(old\.|www\.)?reddit\.com/gi, ''),
				},
			}),
		},
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			th: ['align'],
			td: ['align'],
		},
		allowedClasses: {
			span: ['md-spoiler-text'],
		},
	});
}
