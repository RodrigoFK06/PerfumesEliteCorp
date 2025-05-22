import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
export default async function ProductPreview({
  product,
  isFeatured,
  region,
  variant = "vertical",
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  variant?: "vertical" | "horizontal" | "launch"
}) {

  const { cheapestPrice } = getProductPrice({ product })

  // Variante especial: tarjeta grande para "Nuevos Lanzamientos"
 if (variant === "launch") {
  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group"
    >
      <div className="bg-white rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md overflow-hidden w-full h-full flex flex-col">
        
        {/* Imagen dominante */}
        <div className="relative w-full aspect-[4/5]">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
        </div>

        {/* Contenido compacto */}
        <div className="p-4 pt-2 flex flex-col justify-end gap-1 h-full">
          <div className="flex justify-between items-center">
            <Text className="text-base font-semibold text-[#2E2E2E] truncate">
              {product.title}
            </Text>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              Nuevo
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-[#8B3A15]">
              {cheapestPrice?.calculated_price || "S/ --"}
            </span>
            {/* Star rating span removed */}
          </div>

          <button className="mt-2 bg-[#8B3A15] text-white text-sm py-2 rounded-md hover:bg-[#6a2a0f] transition">
            Ver Detalles
          </button>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

  // Variante estándar: vertical u horizontal
  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group"
    >
      <div
        className={`bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md ${
          variant === "horizontal"
            ? "flex items-center gap-4 p-3 h-full"
            : "p-3 hover:-translate-y-1 shadow-sm"
        }`}
        data-testid="product-wrapper"
      >
        {/* Imagen */}
        <div
          className={`relative overflow-hidden ${
            variant === "horizontal"
              ? "w-28 h-28 flex-shrink-0 rounded-md"
              : "w-full"
          }`}
        >
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
        </div>

        {/* Contenido */}
        <div
          className={`flex flex-col ${
            variant === "horizontal" ? "gap-1" : "gap-2 mt-4"
          }`}
        >
          <Text className="text-base font-semibold text-[#2E2E2E]">
            {product.title}
          </Text>

          {/* "100ml" text block removed */}

          {cheapestPrice && (
            <PreviewPrice price={cheapestPrice} />
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
