import Link from 'next/link'

type PathNavigatorType = {
  productCategory?: string
  productName?: string
}

export const PathNavigator = ({
  productCategory,
  productName,
}: PathNavigatorType) => {
  return (
    <p className="text-sm tracking-wider uppercase">
      <span aria-hidden="true">{'//'}</span>
      Root
      <span aria-hidden="true">{'/'}</span>
      <Link href={'/categories'} className="text-hover">
        Hardware
        <span aria-hidden="true">{'/'}</span>
      </Link>
      {productCategory && (
        <>
          <Link href={'/categories/productCategory'} className="text-hover">
            {productCategory}
            <span aria-hidden="true">{'/'}</span>
          </Link>
        </>
      )}
      {productName && (
        <Link
          href={`/categories/${productCategory}/${productName}`}
          className="text-hover"
        >
          {productName}
        </Link>
      )}
    </p>
  )
}
