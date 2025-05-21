import { Heading, Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-48 px-4 flex flex-col justify-center items-center text-center bg-[#FFF9EF]"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="text-3xl font-bold text-[#1a1a1a] mb-4"
      >
        Tu carrito está vacío
      </Heading>
      
      <Text className="text-base text-gray-700 mb-6 max-w-xl">
        Aún no has agregado ningún producto. Usa el enlace a continuación para empezar a explorar nuestras fragancias.
      </Text>

      <InteractiveLink href="/store">
        Explorar productos →
      </InteractiveLink>
    </div>
  )
}

export default EmptyCartMessage
