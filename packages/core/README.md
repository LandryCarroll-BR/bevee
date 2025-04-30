# 📦 bevies

**bevies** is a lightweight, schema-first content layer inspired by Astro's Content Collections — but built to work with any frontend framework (like Next.js). It provides type-safe collection definitions, flexible data loaders, and runtime validation using Zod.

## ✨ Features

- ✅ Schema-first design with [Zod](https://zod.dev/)
- ✅ Works with remote or local data
- ✅ Auto-validates your content at runtime
- ✅ Fully typed `getEntry`, `getEntries`, and `getCollection` APIs
- ✅ Supports references between collections
- ✅ Lazy loading with caching per collection
- ✅ Developer-friendly DX inspired by Astro Content Collections

## 🚀 Getting Started

### 1. Install

```bash
npm install @repo/bevies zod
```

### 2. Define your collections

```ts
// content/schema.ts
import { z } from 'zod'
import { reference, defineCollection } from '@repo/bevies'

export const blogSchema = z.object({
	title: z.string(),
	slug: z.string(),
	content: z.string(),
	author: reference('authors'),
})

export const authorSchema = z.object({
	name: z.string(),
	bio: z.string(),
})
```

### 3. Register them with `defineCollection`

```ts
// content/index.ts
import { createbevies, defineCollection } from '@repo/bevies'
import { blogSchema, authorSchema } from './schema'

export const bevies = createbevies({
	blog: defineCollection({
		name: 'blog',
		schema: blogSchema,
		loader: async () => [
			{
				id: 'welcome',
				data: {
					title: 'Welcome!',
					slug: 'welcome',
					content: 'Hello world',
					author: { collection: 'authors', id: 'alice' },
				},
			},
		],
	}),
	authors: defineCollection({
		name: 'authors',
		schema: authorSchema,
		loader: async () => [
			{
				id: 'alice',
				data: {
					name: 'Alice',
					bio: 'Loves TypeScript',
				},
			},
		],
	}),
})
```

## 🧠 Usage

### Load everything:

```ts
await bevies.loadAll()
```

### Get all blog posts:

```ts
const posts = await bevies.getCollection('blog')
```

### Filter collection entries:

```ts
const published = await bevies.getCollection('blog', (entry) => entry.data.slug !== 'draft')
```

### Get a single entry by ID:

```ts
const post = bevies.getEntry('blog', 'welcome')
```

### Resolve references:

```ts
const author = bevies.getEntry(post.data.author)
```

### Resolve multiple references:

```ts
const related = bevies.getEntries(post.data.relatedPosts)
```

## 📚 Concepts

| Concept                | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `defineCollection()`   | Defines a typed, schema-validated collection                  |
| `createbevies()`       | Initializes bevies with your collections                      |
| `loader()`             | Provides entries for each collection (can be remote or local) |
| `reference('authors')` | Defines a relationship to another collection                  |

## 🛡️ Type Safety + Validation

All entries are type-checked at compile time using `z.infer<typeof schema>`, and also validated at runtime using Zod. Invalid entries will throw errors during loading.

## 🧪 Coming Soon

- `getEntryBySlug()` helper
- Markdown/MDX rendering support
- Dev-mode live reload for file-based sources
- File system loader (like Astro’s `glob()`)

## 💬 Feedback

This is a pre-release. Please open issues or feature requests as you experiment! We’re excited to see what you build with bevies.
