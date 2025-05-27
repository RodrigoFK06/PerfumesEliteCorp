import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions | string
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams

  const rawSortBy = searchParams.sortBy
  const page = searchParams.page

  let sortBy: SortOptions | undefined = undefined
  let collectionHandle: string | undefined = undefined

  if (rawSortBy?.startsWith("collection_")) {
    collectionHandle = rawSortBy.replace("collection_", "")
  } else if (
    rawSortBy === "price_asc" ||
    rawSortBy === "price_desc" ||
    rawSortBy === "created_at"
  ) {
    sortBy = rawSortBy
  }

  return (
    <div className="bg-[#FFF9EF] min-h-screen px-6 py-10">
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        collectionHandle={collectionHandle} // ✅ solo se pasa si es válido
      />
    </div>
  )
}
