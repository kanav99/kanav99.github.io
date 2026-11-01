import { z } from "zod";
import { fromZodError } from 'zod-validation-error';

// Validate publication and draft front matter.
export default function() {
	return function(data) {
		// Note that drafts may be skipped in a preprocessor (see eleventy.config.js)
		// when doing a standard build (not --serve or --watch)
		let result = z.object({
			draft: z.boolean().or(z.undefined()),
			published: z.boolean().optional(),
		}).safeParse(data);

		if(result.error) {
			throw fromZodError(result.error);
		}
	}
}
