"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview" // Added import
import { convertToLocale } from "@lib/util/money" // Added import

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-[#FFF9EF] p-4 rounded-md">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          {/* Mobile Order Summary */}
          <div className="sm:hidden mb-6"> {/* Hidden on sm screens and up, with margin-bottom */}
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Resumen del Pedido</h3>
            <ItemsPreviewTemplate cart={cart} />
            {cart.total !== null && cart.total !== undefined && cart.currency_code && (
              <div className="flex justify-between items-center text-large-semi font-semibold text-gray-900 mt-4 pt-4 border-t border-gray-300">
                <span>Total:</span>
                <span>
                  {convertToLocale({ amount: cart.total, currency_code: cart.currency_code })}
                </span>
              </div>
            )}
          </div>
          {/* End Mobile Order Summary */}

          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
               Al darle confirmar pedido acepta nuestros terminos y condiciones
               asi como confirma que el pago a sido realizado
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
