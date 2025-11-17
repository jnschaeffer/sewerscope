import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import ReportsList from '@/components/sewerscope/reports'
import Navigation from '@/components/sewerscope/navigation'

export default async function ReportsPage() {
  const supabase = await createClient()

  const claimsResp = await supabase.auth.getClaims()
  if (claimsResp.error || !claimsResp.data?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="w-full h-full">
      <Navigation></Navigation>
      <div className="h-11/12 w-screen p-6">
        <ReportsList></ReportsList>
      </div>
    </div>
  )
}
