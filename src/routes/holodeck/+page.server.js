import holodeck from '$lib/data/holodeck.server.js';

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

function URLReplacer(str) {
	let match = str.match(
		/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
	);
	let final = str;

	if (!match) return str;

	match.map((url) => {
		final = final.replace(url, '<a href="' + url + '" target="_BLANK">' + url + '</a>');
	});
	return final;
}

export const load = ({ params }) => {
	const parsed = holodeck.map((m) => {
		return { ...m, body: URLReplacer(m.body) };
	});

	return { messages: parsed };
};
