"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"
// MUDANÇA: Importando os nomes que existem na sua versão (Group e Separator)
import { Panel, Group, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

// MUDANÇA: Usando ComponentProps de Group em vez de PanelGroup
function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof Group>) {
  return (
    <Group
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  className,
  ...props
}: React.ComponentProps<typeof Panel>) {
  return <Panel className={cn(className)} {...props} />
}

// MUDANÇA: Usando ComponentProps de Separator em vez de PanelResizeHandle
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean
}) {
  return (
    <Separator
      className={cn(
        "bg-border relative flex w-px items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }