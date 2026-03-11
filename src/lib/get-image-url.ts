export const getImageUrl = (category: string, slug: string) => {
  const imageUrl = `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/products/${category}/${slug}.webp`
  return imageUrl
}
