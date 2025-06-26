"use client";

import ModelSelect from "@/components/ModelSelect";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <div className="absolute left-10 z-10">
        <ModelSelect />
      </div>
      {children}
    </Sidebar>
  );
}
