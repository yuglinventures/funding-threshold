"use client"

import { useState, useTransition } from "react"
import posthog from "posthog-js"
import { subscribeToWaitlist } from "./actions"
import { ErrorBoundary } from "./error-boundary"

function EmailForm({
  placeholder = "you@email.com",
  buttonLabel = "Get early access →",
  inputClassName = "",
  buttonClassName = "",
}: {
  placeholder?: string
  buttonLabel?: string
  inputClassName?: string
  buttonClassName?: string
}) {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await subscribeToWaitlist(email)
      if (result.success) {
        setSuccess(true)
        setEmail("")
        posthog.capture("waitlist_signup_success")
      } else {
        setError(result.error ?? "Something went wrong.")
        posthog.capture("waitlist_signup_error", { error: result.error })
      }
    })
  }

  if (success) {
    return (
      <p className="py-3 text-base font-medium text-emerald-600">
        You&rsquo;re on the list! We&rsquo;ll be in touch soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
        className={`flex-1 rounded-full border px-5 py-3 text-base outline-none transition-colors placeholder:text-zinc-400 focus:ring-2 disabled:opacity-60 ${inputClassName}`}
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className={`rounded-full px-6 py-3 font-medium transition-colors disabled:opacity-60 ${buttonClassName}`}
      >
        {isPending ? "Joining…" : buttonLabel}
      </button>
      {error && <p className="w-full text-sm text-red-500">{error}</p>}
    </form>
  )
}

export default function ThresholdLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      q: "Is my card charged when I pledge?",
      a: "No. We place a temporary hold — like a hotel check-in. The charge only goes through if the campaign hits its goal.",
    },
    {
      q: "What happens if the group doesn't reach the threshold?",
      a: "All holds are released automatically when the deadline passes. No one is charged, no action required.",
    },
    {
      q: "How is this different from GoFundMe?",
      a: "GoFundMe charges immediately and keeps money regardless of outcome. Threshold only moves money when the whole group commits.",
    },
    {
      q: "What does it cost?",
      a: "Free to create a campaign. A small platform fee applies only to successful campaigns — you only pay when money actually moves.",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Now in early access
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-balance md:text-5xl">
            No more &apos;I&apos;ll join if others do&apos;
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-zinc-600 text-pretty">
            Create a campaign, share the link. Cards are only charged when your group hits the goal — otherwise every hold is released automatically.
          </p>
          <div className="mb-3">
            <ErrorBoundary>
              <EmailForm
                inputClassName="border-zinc-200 bg-white focus:border-emerald-500 focus:ring-emerald-500/20"
                buttonClassName="bg-emerald-600 text-white hover:bg-emerald-700"
              />
            </ErrorBoundary>
          </div>
          <p className="text-sm text-zinc-500">Free to try · No spam · Unsubscribe anytime</p>
        </div>
      </section>

      {/* Mock Campaign Card */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-sm">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-zinc-200/60">
            <div className="h-28 bg-gradient-to-br from-emerald-400 to-emerald-600" />
            <div className="p-5">
              <h3 className="mb-1 text-lg font-semibold text-zinc-900">Cabin Weekend — Lake Tahoe</h3>
              <p className="mb-4 text-sm text-zinc-500">$250 per person · 8 of 10 committed</p>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full w-[80%] rounded-full bg-emerald-500" />
              </div>
              <p className="mb-4 text-xs text-zinc-500">$2,000 of $2,500 held · 3 days left</p>
              <div className="mb-4 flex -space-x-2">
                {["JD", "KM", "AS", "TB", "LP", "RW", "CH", "MN"].map((initials) => (
                  <div
                    key={initials}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-xs font-medium text-zinc-600"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <button className="w-full rounded-full bg-emerald-600 py-3 font-medium text-white">
                Pledge $250
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 md:text-3xl">
            Good ideas die because no one goes first
          </h2>
          <p className="text-lg leading-relaxed text-zinc-600">
            You&apos;re organizing something together — a trip, a buy, an event. But people won&apos;t commit until they know others will, and you can&apos;t move forward without commitments. The idea stalls. The group chat goes quiet.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-12 text-center text-2xl font-bold text-zinc-900 md:text-3xl">
            How it works
          </h2>
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Create your campaign",
                desc: "Set a goal amount, threshold, and deadline. Takes 2 minutes.",
              },
              {
                step: 2,
                title: "Share the link",
                desc: "Participants pledge with a card hold, not a charge. They see who else is in.",
              },
              {
                step: 3,
                title: "Everyone pays or no one does",
                desc: "Hit the threshold? Cards captured. Fall short? All holds released automatically.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                  {item.step}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-zinc-900">{item.title}</h3>
                  <p className="leading-relaxed text-zinc-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-12 text-center text-2xl font-bold text-zinc-900 md:text-3xl">
            Why groups love Threshold
          </h2>
          <div className="space-y-6">
            {[
              {
                title: "No commitment anxiety",
                desc: "Participants see who else is in before deciding. Social proof built in.",
              },
              {
                title: "Zero risk if the goal isn't hit",
                desc: "Card holds expire automatically if the threshold isn't met.",
              },
              {
                title: "No chasing people down",
                desc: "One link handles progress tracking and confirmation.",
              },
            ].map((benefit) => (
              <div key={benefit.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-semibold text-zinc-900">{benefit.title}</h3>
                <p className="leading-relaxed text-zinc-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500">
            Payments powered by
          </p>
          <p className="mb-4 text-3xl font-bold text-zinc-900">stripe</p>
          <p className="text-sm leading-relaxed text-zinc-500">
            Card holds use Stripe&apos;s manual capture — the same technology used by hotels and ride-sharing apps. Your card details are never stored by us.
          </p>
        </div>
      </section>

      {/* CTA Repeat */}
      <section className="bg-emerald-600 px-6 py-20">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">Ready to make it happen?</h2>
          <p className="mb-8 text-emerald-100">
            Join the waitlist and be first to know when Threshold launches.
          </p>
          <div className="mb-3">
            <ErrorBoundary>
              <EmailForm
                inputClassName="border-emerald-500 bg-white/10 text-white placeholder:text-emerald-200 focus:border-white focus:ring-white/20"
                buttonClassName="bg-white text-emerald-700 hover:bg-emerald-50"
              />
            </ErrorBoundary>
          </div>
          <p className="text-sm text-emerald-200">Free to try · No spam · Unsubscribe anytime</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-10 text-center text-2xl font-bold text-zinc-900 md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left font-medium text-zinc-900"
                >
                  {faq.q}
                  <svg
                    className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="border-t border-zinc-100 px-5 pb-5 pt-3 text-zinc-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm text-zinc-500">
            <span className="font-semibold text-zinc-700">Threshold</span> · Group payments, only when everyone&apos;s in
          </p>
        </div>
      </footer>
    </div>
  )
}
