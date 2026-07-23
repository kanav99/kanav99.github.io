import Fetch from "@11ty/eleventy-fetch";
import { parseDocument } from "htmlparser2";
import { findAll, textContent } from "domutils";

const SCHOLAR_USER_ID = "QEFy_4wAAAAJ";
const SCHOLAR_URL = `https://scholar.google.com/citations?hl=en&user=${SCHOLAR_USER_ID}&cstart=0&pagesize=100&sortby=pubdate`;

export default async function() {
	try {
		const html = await Fetch(SCHOLAR_URL, {
			duration: "1d",
			type: "text",
			fetchOptions: {
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
				}
			}
		});

		const doc = parseDocument(html);
		const rows = findAll(el => el.attribs?.class?.split(" ").includes("gsc_a_tr"), doc.children);

		return rows.map(row => {
			const titleEl = findAll(el => el.attribs?.class?.split(" ").includes("gsc_a_at"), [row])[0];
			const grayDivs = findAll(el => el.name === "div" && el.attribs?.class === "gs_gray", [row]);
			const citeEl = findAll(el => el.attribs?.class?.split(" ").includes("gsc_a_ac"), [row])[0];
			const yearEl = findAll(el => el.attribs?.class?.split(" ").includes("gsc_a_hc"), [row])[0];

			return {
				title: textContent(titleEl).trim(),
				url: `https://scholar.google.com${titleEl.attribs.href}`,
				authors: grayDivs[0] ? textContent(grayDivs[0]).trim() : "",
				venue: grayDivs[1] ? textContent(grayDivs[1]).replace(/,?\s*\d{4}\s*$/, "").trim() : "",
				citations: citeEl ? parseInt(textContent(citeEl).trim(), 10) || 0 : 0,
				year: yearEl ? textContent(yearEl).trim() : ""
			};
		}).filter(pub => pub.title)
			.sort((a, b) => b.year.localeCompare(a.year));
	} catch (e) {
		console.warn(`[publications] Could not fetch Google Scholar profile, skipping: ${e.message}`);
		return [];
	}
};
