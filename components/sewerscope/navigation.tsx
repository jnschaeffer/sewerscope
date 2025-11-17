"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navigation() {
  const logout = async () => {
    fetch('/auth/logout', {method: 'POST'})

    window.location.assign('/auth/login')
  }

  return (
        <div className="flex w-full">
          <NavigationMenu className="flex px-6 pt-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}><Link href="/">Map</Link></NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}><Link href="/reports">Reports</Link></NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}><Link href="/about">About</Link></NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <NavigationMenu className="ml-auto flex px-6 pt-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Button onClick={logout}>Log out</Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
  )
}
