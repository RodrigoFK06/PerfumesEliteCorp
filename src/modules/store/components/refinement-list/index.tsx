"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { clx } from "@medusajs/ui" // Added import

import SortProducts, { SortOptions } from "./sort-products"
import { HttpTypes } from "@medusajs/types"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
  product_categories?: HttpTypes.StoreProductCategory[] | null
}

const RefinementList = ({
  sortBy,
  'data-testid': dataTestId,
  product_categories,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Renamed from createQueryString
  const createSortByQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  // Renamed from setQueryParams
  const setSortByQueryParam = (name: string, value: string) => {
    const query = createSortByQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const updateCategoryQueryString = useCallback(
    (categoryId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const currentCategoryIds = params.getAll("category_id")

      if (currentCategoryIds.includes(categoryId)) {
        // Remove categoryId
        const newCategoryIds = currentCategoryIds.filter(
          (id) => id !== categoryId
        )
        params.delete("category_id")
        newCategoryIds.forEach((id) => params.append("category_id", id))
      } else {
        // Add categoryId
        params.append("category_id", categoryId)
      }
      return params.toString()
    },
    [searchParams]
  )

  const toggleCategoryQueryParam = (categoryId: string) => {
    const newQueryString = updateCategoryQueryString(categoryId)
    router.push(`${pathname}?${newQueryString}`)
  }

  const selectedCategoryIds = searchParams.getAll("category_id")

  return (
    <div className="flex flex-col gap-6 small:min-w-[250px] small:ml-[1.675rem] py-4 mb-8 small:px-0 pl-6" data-testid={dataTestId}>
      <SortProducts sortBy={sortBy} setQueryParams={setSortByQueryParam} />
      
      {product_categories && product_categories.length > 0 && (
        <div>
          <h3 className="text-base font-semibold">Categories</h3>
          <ul className="flex flex-col gap-y-2 mt-2">
            {product_categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => toggleCategoryQueryParam(category.id)}
                  className={clx(
                    "w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-sm",
                    {
                      "font-semibold text-ui-fg-interactive bg-blue-50 hover:bg-blue-100":
                        selectedCategoryIds.includes(category.id),
                      "text-ui-fg-subtle hover:text-ui-fg-base":
                        !selectedCategoryIds.includes(category.id),
                    }
                  )}
                  data-testid={`category-filter-${category.name.toLowerCase()}`}
                >
                  {category.name} 
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default RefinementList
