import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import Footer from "@modules/layout/templates/footer"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contenido del checkout */}
      <main className="flex-1 w-full grid grid-cols-1 gap-y-8">
        <div className="bg-[#FFF9EF] rounded-lg shadow-md p-6">
          <Addresses cart={cart} customer={customer} />
        </div>

        <div className="bg-[#FFF9EF] rounded-lg shadow-md p-6">
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />
        </div>

        <div className="bg-[#FFF9EF] rounded-lg shadow-md p-6">
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
        </div>

        <div className="bg-[#FFF9EF] rounded-lg shadow-md p-6">
          <Review cart={cart} />
        </div>
      </main>
    </div>
  )
}
