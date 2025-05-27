import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  collectionHandle, // ✅ nuevo prop
}: {
  sortBy?: SortOptions
  page?: number | string
  countryCode: string
  collectionHandle?: string // ✅ nuevo prop
}) => {
  const pageNumber = typeof page === "string" ? parseInt(page) : page ?? 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title" className="text-[#1a1a1a] font-semibold">
            {collectionHandle
              ? `Colección: ${collectionHandle.replace(/-/g, " ").toUpperCase()}`
              : "Todos los productos"}
          </h1>
        </div>

        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            collectionHandle={collectionHandle} // ✅ lo pasamos aquí
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
