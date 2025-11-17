import Link from 'next/link'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import Navigation from '@/components/sewerscope/navigation'

export default async function AboutPage() {
  const supabase = await createClient()

  const claimsResp = await supabase.auth.getClaims()
  if (claimsResp.error || !claimsResp.data?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="w-full h-full">
      <Navigation></Navigation>
      <div className="w-full h-full p-6">
        <h1 className="font-semibold pb-2">There are over 60,000 storm drains in Philadelphia. Sewer Scope helps residents keep track of them.</h1>
        <p className="pb-2">While the city's <Link href="https://www.phila.gov/departments/philly311/">311 system</Link> lets users report problems with storm drains, the submission process is slow and tedious. This app lets users submit reports to the city in as little as three taps on a mobile device.</p>
        <p className="pb-10">To get started, go to the <Link href="/">map</Link> and find a storm drain.</p>
        <p className="mt-auto">Built by <Link href="https://schaeffer.io/">John Schaeffer</Link>.</p>
      </div>
    </div>
  )
}
