import { z } from 'zod'
import { CollectionDefinition, CollectionEntry, Reference } from './types'

export function createBevies<CM extends Record<string, CollectionDefinition<z.ZodTypeAny>>>(collections: CM) {
	type CollectionName = Extract<keyof CM, string>

	type InferEntry<C extends CollectionName> = CollectionEntry<CM[C]['schema']>

	const stores: {
		[K in CollectionName]?: Map<string, CollectionEntry<CM[K]['schema']>>
	} = {}

	function load<C extends CollectionName>(collection: C, entries: InferEntry<C>[]) {
		const map = new Map(entries.map((e) => [e.id, e]))
		stores[collection] = map
	}

	const loaded = new Set<CollectionName>()

	async function getCollection<C extends CollectionName>(
		name: C,
		filter?: (entry: InferEntry<C>) => boolean
	): Promise<InferEntry<C>[]> {
		if (!loaded.has(name)) {
			const { schema, loader } = collections[name]
			const entries = await loader()
			const validated = entries.map((entry) => ({
				...entry,
				data: schema.parse(entry.data),
			}))
			load(name, validated)
			loaded.add(name)
		}

		const entries = Array.from(stores[name]?.values() ?? [])
		return filter ? entries.filter(filter) : entries
	}

	function getEntry<C extends CollectionName>(ref: Reference<C>): InferEntry<C> | undefined
	function getEntry<C extends CollectionName>(collection: C, id: string): InferEntry<C> | undefined
	function getEntry<C extends CollectionName>(...args: [C, string] | [Reference<C>]): InferEntry<C> | undefined {
		const [collection, id] = typeof args[0] === 'string' ? [args[0], args[1]] : [args[0].collection, args[0].id]

		if (!id) {
			throw new Error(`Invalid reference: ${JSON.stringify(args[0])}. Expected a reference with a valid id.`)
		}

		return stores[collection]?.get(id)
	}

	function getEntries<C extends CollectionName>(refs: Reference<C>[]): InferEntry<C>[] {
		return refs.map((ref) => getEntry(ref)).filter((e): e is InferEntry<C> => Boolean(e))
	}

	async function loadAll() {
		for (const key in collections) {
			const { schema, loader } = collections[key]
			const entries = await loader()
			const validated = entries.map((entry) => ({
				...entry,
				data: schema.parse(entry.data),
			}))
			load(key as CollectionName, validated)
			loaded.add(key as CollectionName)
		}
	}

	return {
		schemas: Object.fromEntries(Object.entries(collections).map(([key, value]) => [key, value.schema])) as {
			[K in keyof CM]: CM[K]['schema']
		},
		load,
		loadAll,
		getCollection,
		getEntry,
		getEntries,
	}
}
