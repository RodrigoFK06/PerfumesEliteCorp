import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment" // Added import
import { listCartPaymentMethods } from "@lib/data/payment" // Added import
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  // Fetch shipping and payment methods
  const shippingMethods = cart ? await listCartShippingMethods(cart.id) : null
  const paymentMethods = cart?.region?.id
    ? await listCartPaymentMethods(cart.region.id)
    : null

  // Optional: Add notFound() or error handling if methods are essential and null
  // For now, CheckoutForm is expected to handle null props for these.
  // if (!shippingMethods || !paymentMethods) {
  //   return notFound(); // Or some other error display
  // }

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-16 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm
          cart={cart}
          customer={customer}
          shippingMethods={shippingMethods}
          paymentMethods={paymentMethods}
        />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
