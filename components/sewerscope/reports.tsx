import Image from "next/image"

import { createClient } from '@/lib/supabase/server'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '../ui/item'
import Link from "next/link"
import { redirect } from "next/navigation"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Card, CardContent } from "../ui/card"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

type ReportWithImage = {
  id: number,
  title: string,
  created_at: Date,
  description: string,
  imageUrls?: string[],
  thumbnailUrl: string,
}

export default async function ReportsList() {
  const supabase = await createClient()

  const claimsResp = await supabase.auth.getClaims()
  if (claimsResp.error || !claimsResp.data?.claims) {
    redirect('/auth/login')
  }

  const { data } = await supabase.from('reports').select(`
  id,
  created_at,
  description,
  inlets (
    objectid,
    x_coord,
    y_coord,
    operator
  ),
  images (
    path
  )
  `)

  const withImages: ReportWithImage[] = []

  for (const report of data!) {
    let out: ReportWithImage = {
      id: report.id,
      title: `Inlet #${report.inlets.objectid} (${report.inlets.x_coord}, ${report.inlets.y_coord})`,
      created_at: new Date(report.created_at),
      description: report.description,
      thumbnailUrl: '/gray.png',
    }

    if (report.images.length > 0) {
      out.imageUrls = []

      for (const image of report.images) {
        const { data } = await supabase.storage.from('sewerscopeimg').createSignedUrl(image.path, 120)
        out.imageUrls.push(data!.signedUrl)
      }

      out.thumbnailUrl = out.imageUrls[0]
    }

    withImages.push(out)
  }

  const maybeCarousel = (urls?: string[]) => {
    if (urls === undefined) {
      return (
        <p>No media found</p>
      )
    }

    return (
      <div className="m-auto">
          <div className="flex space-x-4 p-4">
            {
              urls.map((u) => {
                console.log(u)
                return (
                  <div key={u} className="w-1/3">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center">
                        <Image
                          alt="image"
                          src={u}
                          height={300}
                          width={400}
                          loading="lazy"
                        />
                      </CardContent>
                    </Card>
                  </div>
                )
              })
            }
          </div>
      </div>
    )
  }

  const items = withImages.map((report) => (
        <Sheet key={report.id}>
          <SheetTrigger asChild>
            <Item variant="outline">
            <ItemMedia variant="image">
              <Image
                alt="image"
                src={report.thumbnailUrl}
                width={32}
                height={32}
                loading="eager"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="line-clamp-1">{report.title}</ItemTitle>
              <ItemDescription>{report.description}</ItemDescription>
            </ItemContent>
            </Item>
          </SheetTrigger>
          <SheetContent className="min-w-3/6 max-w-3/6 max-h-screen overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>{report.title}</SheetTitle>
              <SheetDescription>Report details</SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                <h1 className="font-semibold">Created on</h1>
                <p>{report.created_at.getMonth()}/{report.created_at.getDay()}/{report.created_at.getFullYear()}</p>
                <h1 className="font-semibold">Description</h1>
                <p>{report.description}</p>
                <h1 className="font-semibold">Media</h1>
                {maybeCarousel(report.imageUrls)}
              </div>
            </div>
          </SheetContent>
        </Sheet>
  ))

  const itemGroup = (
    <ItemGroup className="gap-4">
      { items }
    </ItemGroup>
  )

  const noItemsFound = (
    <p>No reports found. Why not go <Link href="/">add some</Link>?</p>
  )

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      { items.length > 0 ? itemGroup : noItemsFound }
    </div>
  )
}
