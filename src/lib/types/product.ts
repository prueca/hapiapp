import z from 'zod'

export const ProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
    price: z.number(),
    currency: z.string(),
    size_value: z.number(),
    size_unit: z.string(),
    packaging: z.string()
})

export type Product = z.infer<typeof ProductSchema>

export type SortKey = 'name' | 'price-asc' | 'price-desc'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' }
]
