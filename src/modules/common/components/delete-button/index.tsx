import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"
import ErrorMessage from "@modules/checkout/components/error-message" // Added import

const DeleteButton = ({
  id,
  children,
  className,
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null) // Added error state

  const handleDelete = async (id: string) => {
    setError(null) // Clear previous errors
    setIsDeleting(true)
    await deleteLineItem(id).catch((err) => {
      setIsDeleting(false)
      setError("Failed to remove item. Please try again.") // Set error message
    })
    // setIsDeleting(false) should ideally be in a .finally() block if the operation always concludes,
    // but for this specific change, we only set it in .catch if an error occurs.
    // If deleteLineItem resolves, isDeleting will remain true without this change.
    // For the sake of this task, I will assume that successful deletion leads to component unmount or parent state change.
    // If not, isDeleting should be set to false on success too.
    // The original code only sets it to false on error. Let's refine this slightly to ensure isDeleting is always reset.
    .finally(() => {
      setIsDeleting(false);
    });
  }

  return (
    <div
      className={clx(
        "flex flex-col items-start text-small-regular", // Changed to flex-col and items-start for error message layout
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        {isDeleting ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
      <ErrorMessage error={error} data-testid="delete-item-error-message" /> {/* Added ErrorMessage component */}
    </div>
  )
}

export default DeleteButton
