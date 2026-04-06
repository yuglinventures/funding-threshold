"use server"

export async function subscribeToWaitlist(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const formId = process.env.NEXT_PUBLIC_LOOPS_FORM_ID
  if (!formId) {
    return { success: false, error: "Configuration error — please try again later." }
  }

  try {
    const res = await fetch(`https://app.loops.so/api/newsletter-form/${formId}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email }),
    })

    if (!res.ok) {
      return { success: false, error: "Failed to subscribe. Please try again." }
    }

    return { success: true }
  } catch {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
