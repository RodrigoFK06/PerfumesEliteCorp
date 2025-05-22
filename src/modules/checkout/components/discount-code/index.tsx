"use client"

import { Badge, Heading, Input, Label, Text } from "@medusajs/ui"
import React, { useActionState } from "react"

import { applyPromotions, submitPromotionForm } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart // Updated prop type
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const promotionsToDisplay =
    cart.discounts
      ?.filter(
        (discount) => discount.is_applied && discount.rule !== undefined
      )
      .map((discount) => ({
        id: discount.id, // Or discount.rule.id if that's more stable for keys
        code: discount.rule!.code!, // Non-null assertion as rule is checked
        is_automatic: discount.rule!.type === "free_shipping", // Example: adjust if other automatic types exist
        value: discount.rule!.value!, // Non-null assertion
        type: discount.rule!.type!, // Non-null assertion
        currency_code: cart.currency_code, // From cart
      })) || []

  const removePromotionCode = async (codeToRemove: string) => {
    const codesToKeep =
      cart.discounts
        ?.filter(
          (d) =>
            d.is_applied &&
            d.rule?.code &&
            d.rule.code !== codeToRemove &&
            d.rule.type !== "free_shipping" // Assuming free_shipping is automatic and not manually removable this way
        )
        .map((d) => d.rule!.code!) || []
    await applyPromotions(codesToKeep)
  }

  const addPromotionCode = async (formData: FormData) => {
    const newCode = formData.get("code")?.toString()
    if (!newCode) return

    const input = document.getElementById("promotion-input") as HTMLInputElement
    const existingCodes =
      cart.discounts
        ?.filter(
          (d) =>
            d.is_applied && d.rule?.code && d.rule.type !== "free_shipping"
        )
        .map((d) => d.rule!.code!) || []

    if (!existingCodes.includes(newCode)) {
      existingCodes.push(newCode)
    }
    await applyPromotions(existingCodes)
    if (input) input.value = ""
  }

  // The useActionState for submitPromotionForm might need adjustment if it also relies on the old promotions structure.
  // For now, focusing on the direct changes requested.
  const [message, formAction] = useActionState(submitPromotionForm, null)


  return (
    <div className="w-full flex flex-col bg-[#FFF9EF] px-2 pb-2 pt-0">
      {/* Botón estilizado tipo texto */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium text-[#8B3A15] hover:underline w-fit mb-2"
        data-testid="add-discount-button"
      >
        Agregar código de promoción
      </button>

      {/* Desplegable horizontal al hacer clic */}
      {isOpen && (
        <form
          action={(a) => addPromotionCode(a)} // This directly calls addPromotionCode, bypassing formAction if that was intended for this button
          className="flex items-center gap-2 mb-2"
        >
          <Input
            id="promotion-input"
            name="code"
            type="text"
            placeholder="Código"
            className="w-full max-w-[200px]"
            data-testid="discount-input"
          />
          <SubmitButton
            variant="secondary"
            data-testid="discount-apply-button"
            className="text-sm"
          >
            Aplicar
          </SubmitButton>
        </form>
      )}

      {/* Mensaje de error */}
      {message && ( // This message comes from submitPromotionForm, which might be outdated
        <ErrorMessage
          error={message}
          data-testid="discount-error-message"
          className="mb-2"
        />
      )}

      {/* Lista de promociones activas */}
      {promotionsToDisplay.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          <Heading className="text-sm font-semibold mb-1">
            Promociones aplicadas:
          </Heading>
          {promotionsToDisplay.map((promo) => (
            <div
              key={promo.id}
              className="flex justify-between items-center text-sm bg-white px-3 py-1 rounded shadow-sm"
            >
              <Text className="truncate max-w-[70%]">
                <Badge
                  color={promo.is_automatic ? "green" : "grey"}
                  size="small"
                >
                  {promo.code}
                </Badge>{" "}
                (
                {promo.value !== undefined &&
                  promo.currency_code !== undefined && ( // Use currency_code from mapped promo
                    <>
                      {promo.type === "percentage"
                        ? `${promo.value}%`
                        : convertToLocale({
                            amount: Number(promo.value), // Ensure value is a number
                            currency_code: promo.currency_code,
                          })}
                    </>
                  )}
                )
              </Text>
              {!promo.is_automatic && (
                <button
                  onClick={() =>
                    promo.code && removePromotionCode(promo.code)
                  }
                  className="text-red-500 hover:text-red-700"
                  data-testid="remove-discount-button"
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiscountCode
