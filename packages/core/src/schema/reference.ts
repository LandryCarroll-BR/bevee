import { z } from 'zod'

export function reference(collectionName: string) {
	return z.object({
		collection: z.literal(collectionName),
		id: z.string(),
	})
}
