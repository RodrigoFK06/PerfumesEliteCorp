import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types" // Added import

import PaginatedProducts from "./paginated-products"

type StoreTemplateProps = {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  product_categories?: HttpTypes.StoreProductCategory[] | null
  categoryIds?: string[] // Added categoryIds prop type
}

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  product_categories,
  categoryIds, // Destructured categoryIds
}: StoreTemplateProps) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} product_categories={product_categories} /> {/* Passed prop */}
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            filterCategoryIds={categoryIds} // Passed categoryIds as filterCategoryIds
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
