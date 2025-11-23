"use client"

import { Tables } from "@/lib/supabase/database.types"
import useWindowDimensions from "@/hooks/resize"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet"
import { Textarea } from "../ui/textarea"
import { createClient } from '@/lib/supabase/client'
import { useSupabaseUpload } from "@/hooks/use-supabase-upload"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../dropzone"

interface WWMapSheetProps {
  inlet?: Tables<'inlets'>
  prefix: string
  onSubmit: () => void
  onClosed: () => void
}

export default function WWMapSheet({inlet, prefix, onSubmit, onClosed}: WWMapSheetProps) {
  const supabase = createClient()

  const [activeUserID, setActiveUserID] = useState<string>()

  const [bucketPath, setBucketPath] = useState<string>()

  const [sheetOpen, setSheetOpen] = useState<boolean>(true)

  const [reportDescription, setReportDescription] = useState<string>()

  const { width } = useWindowDimensions()

  const updateActiveUser = useCallback(
    async () => {
      const { data } = await supabase.auth.getClaims()

      const userID = data!.claims.sub

      const path = `${userID}/${prefix}`

      setActiveUserID(userID)

      setBucketPath(path)
    },
    [supabase],
  )

  useEffect(
    () => {
      updateActiveUser()
    },
    [supabase],
  )

  const supabaseUpload = useSupabaseUpload({
    bucketName: 'sewerscopeimg',
    path: bucketPath,
    allowedMimeTypes: ['image/jpg', 'image/jpeg', 'image/png'],
    maxFiles: 3,
    maxFileSize: 1000 * 1000 * 5, // 5MB,
  })

  const closeSheet = () => {
    setSheetOpen(false)
    window.setTimeout(
      () => {
        console.log('closed')
        onClosed()
      },
      500,
    )
  }

  const onOpenChange = (o: boolean) => {
    if (!o) {
      closeSheet()
    }
  }

  const uploadReport = async () => {
    onSubmit()

    let { data } = await supabase.from('reports').insert({
      user_id: activeUserID,
      inlet_id: inlet!.objectid,
      description: reportDescription!,
    }).select()

    let report = data![0]

    for (let file of supabaseUpload.successes) {
      await supabase.from('images').insert({
        report_id: report.id,
        path: `${bucketPath}/${file}`,
      })
    }

    closeSheet()
  }

  return (
    <Sheet open={sheetOpen && (inlet !== undefined)} onOpenChange={onOpenChange}>
      <SheetContent side={width < 768 ? "bottom" : "right"} className="max-md:h-5/6">
        <SheetHeader>
          <SheetTitle>Inlet #{inlet?.objectid! || 'unknown'}</SheetTitle>
          <SheetDescription>
                              Submit a new issue.
          </SheetDescription>
        </SheetHeader>
        <div className="w-full grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" onChange={(e) => setReportDescription(e.target.value)}/>
          </div>
          <div className="grid gap-3">
            <Dropzone {...supabaseUpload}>
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" disabled={reportDescription == undefined} onClick={uploadReport}>Create</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
