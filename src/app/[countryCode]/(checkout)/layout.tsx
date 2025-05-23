import { Suspense } from "react"
import Image from "next/image"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const regions = await listRegions().then((value) => {
  return value ?? []
})



  return (
    <div className="w-full bg-[#FFF9EF] text-[#2E2E2E] min-h-screen flex flex-col">
      {/* Header igual al de otras páginas */}
      <header className="relative h-20 z-50 border-b bg-black border-ui-border-base">
        <nav className="content-container txt-xsmall-plus flex items-center justify-between w-full h-full text-white">
          {/* IZQUIERDA: Menú lateral */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          {/* CENTRO: Logo y nombre */}
          <div className="flex items-center gap-2">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-3 no-underline"
              data-testid="nav-store-link"
            >
              <Image
                src="/logo-elite.png"
                alt="Perfumes Élite"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-lg font-semibold tracking-wide text-white">
                Perfumes Élite
              </span>
            </LocalizedClientLink>
          </div>

          {/* DERECHA: Cuenta y carrito */}
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-yellow-400 transition"
                href="/account"
                data-testid="nav-account-link"
              >
               
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-yellow-400 flex gap-2 transition"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Carrito (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow relative content-container py-8" data-testid="checkout-container">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="py-0 flex items-center justify-center bg-[#FFF9EF] border-t border-[#E5E5E5]">
        <MedusaCTA />
      </footer>
    </div>
  )
}
