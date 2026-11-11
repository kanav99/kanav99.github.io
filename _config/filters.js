import { DateTime } from "luxon";
import { parser } from "posthtml-parser";
import { render } from "posthtml-render";

// Readers often strip inline CSS; preserve caption formatting with HTML elements too.
export function feedCaptions(html) {
	const tree = parser(String(html || ""));
	let changed = false;
	function formatCaptions(nodes) {
		for (const node of nodes) {
			if (!node || typeof node !== "object") continue;
			if (["script", "style", "pre", "code"].includes(node.tag)) continue;
			if (node.tag === "figcaption") {
				node.content = [{ tag: "small", content: [{ tag: "em", content: node.content || [] }] }];
				changed = true;
			} else if (Array.isArray(node.content)) {
				formatCaptions(node.content);
			}
		}
	}
	formatCaptions(tree);
	return changed ? render(tree) : html;
}

// Read the rendered HTML so Markdown images and optimized <picture> elements work too.
export function feedImage(html, fallbackUrl) {
	function findImage(nodes) {
		for (const node of nodes) {
			if (!node || typeof node !== "object") continue;
			if (["script", "style", "pre", "code"].includes(node.tag)) continue;
			if (node.tag === "img" && node.attrs?.src) {
				try {
					const url = new URL(node.attrs.src);
					if (["http:", "https:"].includes(url.protocol)) {
						return { url: url.href, fallback: false };
					}
				} catch { /* Ignore images without a usable absolute URL. */ }
			}
			if (Array.isArray(node.content)) {
				const image = findImage(node.content);
				if (image) return image;
			}
		}
	}
	return findImage(parser(String(html || ""), { decodeEntities: true }))
		|| { url: fallbackUrl, fallback: true };
}

export default function(eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter("sortAlphabetically", strings =>
		(strings || []).sort((b, a) => b.localeCompare(a))
	);
};
