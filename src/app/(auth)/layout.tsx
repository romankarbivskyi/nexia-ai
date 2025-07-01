import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-10">
      <div className="flex items-center gap-4">
        <Image src="/logo.jpg" alt="Logo" width={50} height={50} />
        <h1 className="text-4xl font-bold">NexiaAI</h1>
      </div>
      {children}
    </div>
  );
}
