"use client"

import * as React from "react"
import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

function DropdownMenuContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  ...props
}: DropdownMenuPrimitive.Popup.Props &
  Pick<
    DropdownMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
      >
        <DropdownMenuPrimitive.Popup
          data-slot="dropdown-content"
          className={cn(
            "min-w-40 overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </DropdownMenuPrimitive.Positioner>
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  className,
  ...props
}: DropdownMenuPrimitive.Item.Props) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: DropdownMenuPrimitive.CheckboxItem.Props) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-checkbox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: DropdownMenuPrimitive.RadioItem.Props) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-radio-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.RadioItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  ...props
}: DropdownMenuPrimitive.GroupLabel.Props) {
  return (
    <DropdownMenuPrimitive.GroupLabel
      data-slot="dropdown-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return (
    <hr
      data-slot="dropdown-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function DropdownMenuSubTrigger({
  className,
  ...props
}: DropdownMenuPrimitive.SubmenuTrigger.Props) {
  return (
    <DropdownMenuPrimitive.SubmenuTrigger
      data-slot="dropdown-sub-trigger"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSubContent({
  className,
  side = "right",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  ...props
}: DropdownMenuPrimitive.Popup.Props &
  Pick<
    DropdownMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
      >
        <DropdownMenuPrimitive.Popup
          data-slot="dropdown-sub-content"
          className={cn(
            "min-w-40 overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </DropdownMenuPrimitive.Positioner>
    </DropdownMenuPrimitive.Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
