"use client"

import { ArrowUturnLeft } from "@medusajs/icons" // Changed import
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"
import { useSearchParams } from "next/navigation" // Added import

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const searchParams = useSearchParams() // Added hook
  const paymentStatus = searchParams.get("status") // Get status parameter

  return (
    <div className="flex flex-col justify-center gap-y-4">
      {/* Conditional message for pending manual payment */}
      {paymentStatus === "pending_manual_payment" && (
        <div
          className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Action Required: </strong>
          <span className="block sm:inline">
            Your order has been successfully received and is awaiting payment
            confirmation.
          </span>
          <p className="mt-2">
            To complete your purchase, please send a screenshot of your payment
            (Yape, Plin, or bank transfer) via WhatsApp to{" "}
            <a
              href="https://wa.me/51960481012"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              960-481-012
            </a>
            .
          </p>
          <p className="mt-2">
            Your order will be processed as soon as payment is verified. Thank
            you!
          </p>
        </div>
      )}
      {/* End of conditional message */}

      <div className="flex gap-2 justify-between items-center">
        <h1 className="text-2xl-semi">Order details</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
          data-testid="back-to-overview-button"
        >
          <ArrowUturnLeft /> Back to overview {/* Replaced icon */}
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-4 h-full bg-white w-full"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
