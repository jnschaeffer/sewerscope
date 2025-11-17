"use client"

import { Tables } from "@/lib/supabase/database.types"
import { useState } from "react"
import WWMap from "./map"
import WWMapSheet from "./mapsheet"

export default function WWMapContainer() {
  const [prefix, setPrefix] = useState<string>('')

  const [inlet, setInlet] = useState<Tables<'inlets'>>()

  const [submitting, setSubmitting] = useState<boolean>(false)

  let updateActivePoint = (p: Tables<'inlets'>) => {
    if (!submitting) {
      setPrefix(crypto.randomUUID())
      setInlet(p)
    }
  }

  const onSubmit = () => {
    setSubmitting(true)
  }

  const onClosed = () => {
    setInlet(undefined)
    setPrefix(crypto.randomUUID())
    setSubmitting(false)
  }

  return (
    <div className="flex w-full h-[100%]">
      <WWMapSheet key={prefix} inlet={inlet} prefix={prefix} onSubmit={onSubmit} onClosed={onClosed}>
      </WWMapSheet>
      <div className="w-full h-full">
        <WWMap inletCallback={updateActivePoint}></WWMap>
      </div>
    </div>
  )
}
