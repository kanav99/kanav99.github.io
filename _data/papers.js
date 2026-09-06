// Papers I loved, grouped into sections.
//
// To add a paper: drop a new entry into the `papers` array of the relevant
// section below. To add a section: append a new `{ name, papers: [...] }`
// object — sections render in the order they appear here.
//
// Per-paper fields:
//   title   (required) — the paper's title
//   url     (optional) — link to the paper; the title is plain text without it
//   authors (optional) — author list, shown under the title
//   venue   (optional) — conference/journal
//   year    (optional) — shown next to the venue
//   note    (optional) — a line on why I loved it

export default [
	{
		name: "Cryptography",
		papers: [
			{
				title: "Game Changer: A Modular Framework for OPRF Security",
				url: "https://eprint.iacr.org/2025/1565",
				authors: "Karla Friedrichs, Anja Lehmann, Cavit Özbay",
				venue: "ASIACRYPT",
				year: "2025",
				note: "super interesting work on OPRFs that is both a charm to read and treats security like a first class citizen."
			},
			{
				title: "Lightweight Techniques for Private Heavy Hitters",
				url: "https://eprint.iacr.org/2021/017",
				authors: "Dan Boneh, Elette Boyle, Henry Corrigan-Gibbs, Niv Gilboa, Yuval Ishai",
				venue: "IEEE S&P",
				year: "2021",
				note: "cute trick and uses DPFs"
			}
		]
	},
	{
		name: "Philosophy",
		papers: [
			{
				title: "A Defense of Abortion",
				url: "https://link.springer.com/chapter/10.1007/978-1-4684-2223-8_5",
				authors: "Judith Jarvis Thomson",
				note: "enlightening essay, easy to read, sound reasoning"
			}
		]
	}
];
