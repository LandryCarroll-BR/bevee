// bevy/src/query.ts
import { getStore } from './load'
import type { CollectionsMap, CollectionEntry, Reference } from './types'

type InferEntry<C extends keyof CollectionsMap> = CollectionEntry<CollectionsMap[C]>

export function getCollection<C extends keyof CollectionsMap>(name: C): InferEntry<C>[] {
	return getStore(name)?.getAll() ?? []
}

export function getEntry<C extends keyof CollectionsMap>(collection: C, id: string): InferEntry<C> | undefined
export function getEntry<C extends keyof CollectionsMap>(ref: Reference<C>): InferEntry<C> | undefined
export function getEntry<C extends keyof CollectionsMap>(
	...args: [C, string] | [Reference<C>]
): InferEntry<C> | undefined {
	const [collection, id] = typeof args[0] === 'string' ? [args[0], args[1]] : [args[0].collection, args[0].id]

	if (!id) {
		throw new Error(`Invalid reference: ${JSON.stringify(args[0])}. Expected a reference with a valid id.`)
	}

	return getStore(collection)?.get(id)
}

export function getEntries<C extends keyof CollectionsMap>(refs: Reference<C>[]): InferEntry<C>[] {
	return refs.map((ref) => getEntry(ref)).filter(Boolean) as InferEntry<C>[]
}
