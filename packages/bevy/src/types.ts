import { z, ZodType } from 'zod'

export type CollectionName = string

export type Reference<C extends string = string> = {
	collection: C
	id: string
}

export type CollectionEntry<T extends ZodType> = {
	id: string
	data: z.infer<T>
	digest?: string
}

export interface Collections {} // <-- intentionally empty!

export type CollectionsMap = Collections

export type CollectionDefinition<T extends z.ZodTypeAny> = {
	__isBevyCollection: true // 🧠 a unique marker
	name: CollectionName
	schema: T
	loader: () => Promise<CollectionEntry<T>[]>
}

export type LoaderFor<T extends ZodType> = () => Promise<Array<{ id: string; data: z.infer<T> }>>
