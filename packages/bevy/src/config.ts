import type { CollectionDefinition } from './types'

const registeredCollections = new Map<string, CollectionDefinition<any>>()

export function registerCollections(defs: Record<string, CollectionDefinition<any>>) {
	for (const def of Object.values(defs)) {
		registeredCollections.set(def.name, def)
	}
}

export function getCollectionDef(name: string) {
	return registeredCollections.get(name)
}

export function getAllCollectionDefs() {
	return Array.from(registeredCollections.values())
}
