import { Hero } from '@/components/marketing/hero'
import { Features } from '@/components/marketing/features'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { UseCases } from '@/components/marketing/use-cases'
import { Models } from '@/components/marketing/models'
import { CompareStrip } from '@/components/marketing/compare'
import { Faq } from '@/components/marketing/faq'
import { FinalCta } from '@/components/marketing/cta'
import { Footer } from '@/components/marketing/footer'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  // Read the user (if Supabase is configured) so the nav can swap CTAs.
  let user: { email?: string | null } | null = null
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user ? { email: data.user.email } : null
    } catch {
      user = null
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f0f0ee]">
      <Hero user={user} />
      <Features />
      <HowItWorks />
      <UseCases />
      <Models />
      <CompareStrip />
      <Faq />
      <FinalCta authed={!!user} />
      <Footer />
    </main>
  )
}
