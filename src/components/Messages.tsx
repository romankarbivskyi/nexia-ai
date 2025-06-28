import { ReactNode } from "react";

interface MessagesProps {
  children: ReactNode;
}

export default function Messages({ children }: MessagesProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
