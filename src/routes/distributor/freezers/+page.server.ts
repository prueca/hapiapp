import db from '$lib/drizzle'

export const load = async ({ locals }) => {
    const distributorId = locals.account?.id

    if (!distributorId) {
        return { ...locals, freezers: [] }
    }

    const freezers = await db.query.freezer.findMany({
        where: (f, { eq, or }) =>
            or(eq(f.distributorId, distributorId), eq(f.designationId, distributorId)),
        columns: {
            createdAt: false,
            deletedAt: false,
            updatedAt: false
        },
        orderBy: (f, { desc }) => desc(f.createdAt)
    })

    return { ...locals, freezers }
}
