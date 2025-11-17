import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import AppMapContainer from '@/components/sewerscope/container'
import Navigation from '@/components/sewerscope/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const claimsResp = await supabase.auth.getClaims()
  if (claimsResp.error || !claimsResp.data?.claims) {
    redirect('/auth/login')
  }

  return (
    <div className="w-full h-full">
      <Navigation></Navigation>
      <div className="h-11/12 w-full p-6">
        <AppMapContainer></AppMapContainer>
      </div>
    </div>
  )
}
