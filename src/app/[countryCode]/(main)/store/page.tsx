import { Metadata } from "next"
import { listCategories } from "@lib/data/categories" // Added import
import { HttpTypes } from "@medusajs/types" // Added import

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}


export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams

  const sortBy = searchParams.sortBy
  const page = searchParams.page
  const collectionId = (searchParams as any).collection || "" // alternativa segura
  const categoryIdParams = (searchParams as any).category_id || [] // Get category_id, ensure it's an array

  const product_categories = await listCategories().catch(() => null) // Fetched categories

  return (
    <div className="bg-[#FFF9EF] min-h-screen px-6 py-10">
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        product_categories={product_categories} // Passed categories
        categoryIds={Array.isArray(categoryIdParams) ? categoryIdParams : [categoryIdParams].filter(Boolean)} // Passed categoryIds
      />
    </div>
  )
}

