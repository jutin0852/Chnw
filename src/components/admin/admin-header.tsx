import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AdminHeaderTitle from "./admin-header-title";

export function AdminHeader() {
  
  return (
    <header className="flex h-[calc(var(--header-height)+env(safe-area-inset-top))] shrink-0 items-center gap-2 border-b pt-[env(safe-area-inset-top)] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <AdminHeaderTitle />
        <div className="ml-auto hidden text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--brand)] sm:block">CHNW</div>
      </div>
    </header>
  );
}
