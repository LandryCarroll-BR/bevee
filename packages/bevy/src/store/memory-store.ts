import { ZodType } from 'zod'
import type { CollectionEntry } from '../types'

export class MemoryStore<T extends ZodType> {
	private entries = new Map<string, CollectionEntry<T>>()

	set(entry: CollectionEntry<T>) {
		this.entries.set(entry.id, entry)
	}

	get(id: string): CollectionEntry<T> | undefined {
		return this.entries.get(id)
	}

	getAll(): CollectionEntry<T>[] {
		return Array.from(this.entries.values())
	}

	clear() {
		this.entries.clear()
	}
}
