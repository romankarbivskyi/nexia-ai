import Image from "next/image";
import { SidebarHeader } from "../ui/sidebar";

export default function AppSidebarHeader() {
  return (
    <SidebarHeader className="flex-row items-center gap-2">
      <Image
        src="/logo.jpg"
        alt="Logo"
        width={32}
        height={32}
        className="flex-shrink-0"
      />
      <h1 className="text-2xl font-bold text-zinc-950 group-data-[collapsible=icon]:hidden">
        NexiaAI
      </h1>
    </SidebarHeader>
  );
}
