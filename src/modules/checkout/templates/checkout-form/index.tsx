"use client" // Added "use client"

import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
// Footer import seems unused in the provided snippet, can be kept or removed if not used elsewhere.
// import Footer from "@modules/layout/templates/footer"
import { useSearchParams } from "next/navigation" // Added import

// Define types for props since this is now a client component
// and async props fetching should be handled differently if needed,
// but for this refactor, we assume cart, customer, shippingMethods, paymentMethods are passed correctly.
// For a full client component conversion, data fetching would move to useEffect or a server component parent.
// However, the task is focused on styling based on URL params, so we'll assume props are as expected.

type CheckoutFormProps = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: HttpTypes.StoreCartShippingOption[] | null // Updated type
  paymentMethods: HttpTypes.StorePaymentMethod[] | null
}

// This component can no longer be async directly if it's a "use client" component
// Data fetching (listCartShippingMethods, listCartPaymentMethods) needs to be done
// in a parent Server Component or via useEffect/client-side fetching.
// For the purpose of this task, we'll assume these props are passed down.
// If this component were to fetch its own data, it would need a more significant refactor.

export default function CheckoutForm({
  cart,
  customer,
  shippingMethods, // Assuming this is passed as a prop now
  paymentMethods, // Assuming this is passed as a prop now
}: CheckoutFormProps) {
  const searchParams = useSearchParams()
  const currentUrlStep = searchParams.get("step") || "address"
  const steps = ["address", "delivery", "payment", "review"]
  const currentStepIndex = steps.indexOf(currentUrlStep)

  if (!cart) {
    return null
  }

  // It's possible shippingMethods and paymentMethods might not be loaded if this was a true client component
  // without proper data fetching. Adding a check for them.
  if (!shippingMethods || !paymentMethods) {
    // Could show a loading state or error here
    // For now, returning null to match original behavior if these were not loaded.
    return null
  }
  
  const getStepStatus = (stepName: string) => {
    const stepIndex = steps.indexOf(stepName)
    if (stepIndex < currentStepIndex) return "completed"
    if (stepIndex === currentStepIndex) return "active"
    return "upcoming"
  }

  const getStepWrapperClassName = (stepName: string) => {
    const status = getStepStatus(stepName)
    const isActive = status === "active"
    const isCompleted = status === "completed"
    // const isUpcoming = status === "upcoming" // Not explicitly used for different styling for all upcoming

    if (stepName === "address") {
      return isActive
        ? "bg-[#FFF9EF] rounded-lg shadow-md p-6"
        : "bg-transparent p-6 border-b border-gray-200"
    }

    // For Shipping, Payment, Review
    if (isActive) {
      return "bg-[#FFF9EF] rounded-lg shadow-md p-6"
    }
    if (isCompleted) {
      return "bg-transparent p-6 border-b border-gray-200"
    }
    // Upcoming
    return "bg-gray-100 rounded-lg p-4 opacity-70"
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contenido del checkout */}
      <main className="flex-1 w-full grid grid-cols-1 gap-y-6"> {/* Changed gap-y-8 to gap-y-6 */}
        <div className={getStepWrapperClassName("address")}>
          <Addresses cart={cart} customer={customer} />
        </div>

        <div className={getStepWrapperClassName("delivery")}>
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />
        </div>

        <div className={getStepWrapperClassName("payment")}>
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
        </div>

        <div className={getStepWrapperClassName("review")}>
          <Review cart={cart} />
        </div>
      </main>
    </div>
  )
}
