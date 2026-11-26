"use client"

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"

/**
 * Admin confirmation toasts: a white card with a coloured icon chip, bold title and a short
 * muted line. Bottom right on computers, top centre on phones (above the keyboard and thumbs).
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const isMobile = useIsMobile()
  return (
    <Sonner
      theme="light"
      position={isMobile ? "top-center" : "bottom-right"}
      duration={3500}
      gap={10}
      visibleToasts={4}
      icons={{
        success: <CircleCheckIcon className="size-[18px]" strokeWidth={2} />,
        info: <InfoIcon className="size-[18px]" strokeWidth={2} />,
        warning: <TriangleAlertIcon className="size-[18px]" strokeWidth={2} />,
        error: <OctagonXIcon className="size-[18px]" strokeWidth={2} />,
        loading: <Loader2Icon className="size-[18px] animate-spin" strokeWidth={2} />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group pointer-events-auto flex w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-black/10 bg-white p-4 pr-10 text-[#141210] shadow-[0_12px_32px_-8px_rgba(20,18,16,0.22),0_2px_6px_rgba(20,18,16,0.06)] sm:w-[360px]",
          icon:
            "mt-px grid size-8 shrink-0 place-items-center rounded-full bg-black/5 text-black/70 group-data-[type=success]:bg-emerald-50 group-data-[type=success]:text-emerald-700 group-data-[type=error]:bg-red-50 group-data-[type=error]:text-[var(--brand)] group-data-[type=warning]:bg-amber-50 group-data-[type=warning]:text-amber-700",
          content: "flex min-w-0 flex-1 flex-col gap-0.5 pt-1",
          title: "text-sm font-semibold leading-5",
          description: "text-[13px] leading-5 text-black/60",
          closeButton:
            "absolute right-2 top-2 grid size-7 place-items-center rounded-md text-black/40 transition-colors hover:bg-black/5 hover:text-black",
          actionButton: "mt-2 rounded-md bg-[#141210] px-3 py-1.5 text-xs font-medium text-white",
        },
      }}
      closeButton
      {...props}
    />
  )
}

export { Toaster }
