"use client"

import React, { useEffect, useActionState } from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
// import { toast } from "@medusajs/ui" // toast is no longer used
import { updateCustomer } from "@lib/data/customer" // Added import

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const updatePassword = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const old_password = formData.get("old_password") as string
    const new_password = formData.get("new_password") as string
    const confirm_password = formData.get("confirm_password") as string

    if (new_password !== confirm_password) {
      return { success: false, error: "New passwords do not match." }
    }

    if (new_password.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters long.",
      }
    }

    const body = { password: new_password, current_password: old_password }

    try {
      await updateCustomer(body)
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  const [state, formAction] = useActionState(updatePassword, {
    error: null,
    success: false,
  })

  const clearState = () => {
    // Resetting formAction state might require a more specific approach if useActionState doesn't reset on form.reset()
    // For now, this primarily clears the visual success state.
    // If state.error needs clearing, it would typically be handled by a new action.
    setSuccessState(false)
    // To clear the error from `state` as well, one might need to call formAction with a specific payload
    // or re-initialize/reset the formAction state if the hook supports it, which is not standard.
    // The AccountInfo component's clearState is tied to its own reset button, which calls this.
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state.success])

  return (
    <form
      action={formAction} // Changed to formAction
      onReset={() => clearState()}
      className="w-full"
    >
      <AccountInfo
        label="Password"
        currentInfo={
          <span>The password is not shown for security reasons</span>
        }
        isSuccess={successState} // This will reflect state.success via useEffect
        isError={!!state.error} // Changed
        errorMessage={state.error || undefined} // Changed
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Old password"
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <Input
            label="New password"
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label="Confirm password"
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
