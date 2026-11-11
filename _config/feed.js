import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { parser } from "posthtml-parser";
import metadata from "../_data/metadata.js";
import { feedCaptions, feedImage } from "./filters.js";

function escapeXml(value) {
	return value.replace(/[&<>"']/g, character => ({
		"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
	})[character]);
}

export default function(eleventyConfig) {
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		templateData: { eleventyNavigation: { key: "Feed", order: 4 } },
		collection: { name: "posts", limit: 10 },
		metadata: {
			language: metadata.language,
			title: metadata.title,
			subtitle: metadata.description,
			base: metadata.url,
			author: metadata.author,
		},
	});

	// Extend the plugin's Atom output with reader-friendly images and captions.
	eleventyConfig.addTransform("feedImagesAndCaptions", function(content) {
		if (!this.outputPath?.replaceAll("\\", "/").endsWith("/feed/feed.xml")) return content;
		const absoluteUrl = url => eleventyConfig.getFilter("htmlBaseUrl").call({}, url, metadata.url);
		const logo = absoluteUrl(metadata.feed.logo);
		return content
			.replace("<feed ", '<feed xmlns:media="http://search.yahoo.com/mrss/" ')
			.replace("</subtitle>", `</subtitle>\n  <logo>${escapeXml(logo)}</logo>\n  <icon>${escapeXml(absoluteUrl(metadata.feed.icon))}</icon>`)
			.replace(/<content type="html">([\s\S]*?)<\/content>/g, (_, escapedHtml) => {
				// Atom HTML content is XML-escaped text; decode it before processing.
				let html = feedCaptions(parser(escapedHtml, { decodeEntities: true }).join(""));
				const image = feedImage(html, logo);
				if (image.fallback) {
					html = `<p><img src="${escapeXml(image.url)}" alt="Pongo sleeping on the couch"></p>${html}`;
				}
				return `<media:content url="${escapeXml(image.url)}" medium="image" isDefault="true" />\n    <media:thumbnail url="${escapeXml(image.url)}" />\n    <content type="html">${escapeXml(html)}</content>`;
			});
	});
}
