"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions =
  | "price_asc"
  | "price_desc"
  | "created_at"
  | "collection_destacados"
  | "collection_nuevos lanzamientos" // ¡Importante! Usamos el `handle` sin slash

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Últimos agregados",
  },
  {
    value: "price_asc",
    label: "Precio de menor a mayor",
  },
  {
    value: "price_desc",
    label: "Precio de mayor a menor",
  },
  {
    value: "collection_destacados",
    label: "Productos Destacados",
  },
  {
    value: "collection_nuevos lanzamientos",
    label: "Nuevos Lanzamientos",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title="Ordenar por"
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
