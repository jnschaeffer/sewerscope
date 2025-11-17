"use client"

import {
    MapMarker,
} from "@/components/ui/map"

import { LatLngBounds } from 'leaflet'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

import { Tables } from '@/lib/supabase/database.types'

import { useMapEvents } from "react-leaflet"

interface WWMapProps {
  inletCallback: (p: Tables<'inlets'>) => void
}

export default function WWInletLayer({inletCallback}: WWMapProps) {
  const supabase = createClient()

  const [inlets, setInlets] = useState<Tables<'inlets'>[]>()

  const updatePoints = async (bounds: LatLngBounds) => {
      const southwest = bounds.getSouthWest()
      const northeast = bounds.getNorthEast()

      // Bail if our bounding box is too big
      if ((northeast.lat - southwest.lat > .015) || northeast.lng - southwest.lng > .03) {
        setInlets([])
        return
      }

      const { data } = await supabase.from('inlets')
        .select()
        .eq('operator', 'PWD')
        .gte('y_coord', southwest.lat)
        .lte('y_coord', northeast.lat)
        .gte('x_coord', southwest.lng)
        .lte('x_coord', northeast.lng)

      return data!
    }

  const map = useMapEvents({
    load: async () => {
      const inlets = await updatePoints(map.getBounds())

      setInlets(inlets)
    },
    moveend: async () => {
      const inlets = await updatePoints(map.getBounds())

      setInlets(inlets)
    },
  })

  const markers = inlets?.map((p) => <MapMarker key={p.objectid} position={[p.y_coord!, p.x_coord!]} eventHandlers={{click: () => inletCallback(p)}}>
                                  </MapMarker>)

  return (
    <div>
  {markers}
    </div>
  )
}
