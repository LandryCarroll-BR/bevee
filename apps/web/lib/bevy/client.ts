import { createbevee, defineCollection, reference } from '@bevee/core'
import { z } from 'zod'

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

export const bevee = createbevee({
	blogs: defineCollection({
		name: 'blogs',
		schema: blogSchema,
		loader: async () => [
			{
				id: 'welcome',
				data: {
					title: 'Welcome!',
					slug: 'welcome',
					content: 'Hello world',
					author: {
						collection: 'authors',
						id: 'alice',
					},
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
