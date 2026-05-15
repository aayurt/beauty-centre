"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"

import { cn } from "@/lib/utils"

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerBackdrop({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  )
}

function DrawerPopup({
  className,
  side = "bottom",
  ...props
}: DrawerPrimitive.Popup.Props & {
  side?: "left" | "right" | "top" | "bottom"
}) {
  return (
    <DrawerPortal>
      <DrawerBackdrop />
      <DrawerPrimitive.Popup
        data-slot="drawer-popup"
        className={cn(
          "fixed z-50 flex flex-col bg-background shadow-xl outline-none duration-100",
          side === "left" &&
            "left-0 top-0 bottom-0 h-full w-full max-w-72 data-open:animate-in data-open:slide-in-from-left-full data-closed:animate-out data-closed:slide-out-to-left-full",
          side === "right" &&
            "right-0 top-0 bottom-0 h-full w-full max-w-72 data-open:animate-in data-open:slide-in-from-right-full data-closed:animate-out data-closed:slide-out-to-right-full",
          side === "top" &&
            "top-0 left-0 right-0 w-full data-open:animate-in data-open:slide-in-from-top-full data-closed:animate-out data-closed:slide-out-to-top-full",
          side === "bottom" &&
            "bottom-0 left-0 right-0 w-full data-open:animate-in data-open:slide-in-from-bottom-full data-closed:animate-out data-closed:slide-out-to-bottom-full",
          className,
        )}
        {...props}
      />
    </DrawerPortal>
  )
}

function DrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex items-center justify-between border-b px-4 py-3", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  ...props
}: DrawerPrimitive.Content.Props) {
  return (
    <DrawerPrimitive.Content
      data-slot="drawer-content"
      className={cn("flex-1 overflow-auto p-4", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerPopup,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
