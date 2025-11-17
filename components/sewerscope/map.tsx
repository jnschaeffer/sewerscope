"use client"

import {
    Map,
    MapLocateControl,
    MapTileLayer,
    MapZoomControl,
} from "@/components/ui/map"

import { Tables } from '@/lib/supabase/database.types'
import WWInletLayer from "./layer"
import { Button } from "../ui/button"
import { CircleQuestionMarkIcon } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '../ui/sheet'

interface WWMapProps {
  inletCallback: (p: Tables<'inlets'>) => void
}

export default function WWMap({inletCallback}: WWMapProps) {
  return (
    <div className="h-full">
      <Map center={[39.95258, -75.16358]}>
        <MapTileLayer />
        <MapZoomControl />
        <div className="absolute top-1 right-1 left-auto z-1000 grid gap-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon"><CircleQuestionMarkIcon/></Button>
            </SheetTrigger>
            <SheetContent className="min-w-3/6 max-w-3/6">
              <SheetHeader>
                <SheetTitle>
                              How to use
                </SheetTitle>
              </SheetHeader>
              <div className="w-full grid flex-1 auto-rows-min gap-6 px-4">
                <p>Zoom to the location of the storm drain you would like to report and select the point on the map. If you do not see any points, try zooming in.</p>
                <p>You can submit up to 3 images for every storm drain report.</p>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <WWInletLayer inletCallback={inletCallback}></WWInletLayer>
      </Map>
    </div>
  )
}
