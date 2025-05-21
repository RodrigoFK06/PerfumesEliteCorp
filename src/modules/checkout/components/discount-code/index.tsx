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
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { promotions = [] } = cart

  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter((p) => p.code !== code)

    await applyPromotions(
      validPromotions.filter((p) => p.code === undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    const code = formData.get("code")
    if (!code) return

    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code === undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    await applyPromotions(codes)
    if (input) input.value = ""
  }

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
          action={(a) => addPromotionCode(a)}
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
      {message && (
        <ErrorMessage
          error={message}
          data-testid="discount-error-message"
          className="mb-2"
        />
      )}

      {/* Lista de promociones activas */}
      {promotions.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          <Heading className="text-sm font-semibold mb-1">
            Promociones aplicadas:
          </Heading>
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex justify-between items-center text-sm bg-white px-3 py-1 rounded shadow-sm"
            >
              <Text className="truncate max-w-[70%]">
                <Badge
                  color={promotion.is_automatic ? "green" : "grey"}
                  size="small"
                >
                  {promotion.code}
                </Badge>{" "}
                (
                {promotion.application_method?.value !== undefined &&
                  promotion.application_method.currency_code !== undefined && (
                    <>
                      {promotion.application_method.type === "percentage"
                        ? `${promotion.application_method.value}%`
                        : convertToLocale({
                            amount: promotion.application_method.value,
                            currency_code:
                              promotion.application_method.currency_code,
                          })}
                    </>
                  )}
                )
              </Text>
              {!promotion.is_automatic && (
                <button
                  onClick={() =>
                    promotion.code && removePromotionCode(promotion.code)
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
