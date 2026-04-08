export const getImageUrl = async (category: string, slug: string) => {
  if (!category || !slug) return null

  const imageUrl = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/products/${category}/${slug}.webp`

  try {
    const response = await fetch(imageUrl, { method: 'HEAD' })

    return response.ok ? imageUrl : null
  } catch (error) {
    return null
  }
}
