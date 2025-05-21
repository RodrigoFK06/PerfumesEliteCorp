import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-[#FFF9EF] p-4 rounded-md shadow-sm">
      <div>
        <Heading level="h2" className="txt-xlarge">
          Ya tienes una cuenta?
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          Inicia sesion para una mejor experiencia.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10" data-testid="sign-in-button">
            Iniciar sesión
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
