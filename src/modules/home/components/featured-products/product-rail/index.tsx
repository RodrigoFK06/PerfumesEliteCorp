import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
  size = "default",
  variant = "vertical",
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
  size?: "default" | "compact"
  variant?: "vertical" | "horizontal" | "launch"
}) {
  const {
    response: { products: allProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      fields:
        "id,title,handle,thumbnail,images,collection.id,collection.title,variants.calculated_price",
      limit: 100,
    },
  })

  const filteredProducts = allProducts.filter(
    (p) => p.collection?.id === collection.id
  )

  if (!filteredProducts || filteredProducts.length === 0) return null

  return (
    <section className={`w-full ${variant === "launch" ? "pt-4 pb-10" : "py-6"} bg-white`}>
      <div className="content-container">
        {/* Título solo si es "launch" */}
        {variant === "launch" && (
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
          </h2>
        )}

        <ul
  className={`${
    variant === "launch"
      ? "flex flex-wrap gap-x-6 gap-y-10 justify-start"
      : variant === "horizontal"
      ? "flex flex-wrap gap-4"
      : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12"
  }`}
>
  {filteredProducts.map((product) => (
    <li
      key={product.id}
      className={`${
        variant === "launch"
          ? "w-[440px] h-[780px] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between"
          : variant === "horizontal"
          ? "p-3 w-[280px] h-[140px] bg-white rounded-md shadow-sm border border-gray-200"
          : size === "compact"
          ? "p-1 max-w-[180px] bg-white rounded-md shadow-sm border border-gray-200"
          : "p-3 max-w-[260px] bg-white rounded-md shadow-sm border border-gray-200"
      } hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-200`}
    >
      <ProductPreview
        product={product}
        region={region}
        isFeatured
        variant={variant}
      />
    </li>
  ))}
</ul>
{variant === "launch" && (
  <div className="w-full flex justify-center mt-10">
    <a
      href="/store"
      className="bg-[#8B3A15] hover:bg-[#6a2a0f] text-white text-sm font-semibold py-2 px-6 rounded-md transition duration-200"
    >
      Ver Todos
    </a>
  </div>
)}


      </div>
    </section>
  )
}
