"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // Determine max selectable quantity based on inventory and backorder policy
  let max_options_to_display: number
  if (
    item.variant?.manage_inventory === false ||
    item.variant?.allow_backorder === true
  ) {
    max_options_to_display = 50 // Sensible upper limit when inventory is not managed or backorders are allowed
  } else {
    max_options_to_display = item.variant?.inventory_quantity ?? 0 // Use inventory_quantity, default to 0 if null/undefined
  }

  let final_loop_limit = Math.min(max_options_to_display, 50)

  // Edge case: If stock is 0 and no backorders, but item is in cart (e.g. quantity > 0)
  // Allow selecting up to current quantity or a small cap like 10.
  if (final_loop_limit === 0 && item.quantity > 0) {
    final_loop_limit = Math.min(Math.max(1, item.quantity), 10)
  }
  // Ensure there's at least one option if the item is in the cart, even if final_loop_limit ended up 0
  // For example, if item.quantity is 0 (should not happen for an item in cart) and inventory is 0.
  // However, the loop `Array.from({ length: final_loop_limit })` handles length 0 correctly (empty array).
  // And if quantity is 1, `Math.max(1,1)` is 1. If quantity is 0, `Math.max(1,0)` is 1. So it will show at least 1.
  // The condition `item.quantity > 0` in the above if block already ensures we only adjust if item is genuinely in cart.
  // If `final_loop_limit` is 0 and `item.quantity` is also 0, then `final_loop_limit` remains 0, and no options are rendered, which is fine.

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-20": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-4"
              data-testid="product-select-button"
            >
              {Array.from(
                {
                  length: final_loop_limit,
                },
                (_, i) => (
                  <option value={i + 1} key={i + 1}>
                    {i + 1}
                  </option>
                )
              )}
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
