import { getAllCollectionDefs, getCollectionDef } from './config'
import { MemoryStore } from './store/memory-store'

const stores = new Map<string, MemoryStore<any>>()

export async function loadCollection(name: string) {
	const def = getCollectionDef(name)
	if (!def) throw new Error(`Collection "${name}" not registered`)

	const store = new MemoryStore()
	const entries = await def.loader()
	entries.forEach((e) => store.set(e))

	stores.set(name, store)
}

export async function loadAllCollections() {
	for (const def of getAllCollectionDefs()) {
		await loadCollection(def.name)
	}
}

export function getStore(name: string): MemoryStore<any> | undefined {
	return stores.get(name)
}
