import { z, ZodType } from 'zod'
import type { CollectionDefinition } from './types'

export function defineCollection<T extends ZodType>(def: {
	name: string
	schema: T
	loader: () => Promise<Array<{ id: string; data: z.infer<T> }>>
}): CollectionDefinition<T> {
	return {
		__isbeveeCollection: true,
		...def,
	}
}
