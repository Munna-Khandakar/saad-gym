import Image from "next/image";

export function Header() {
  return (
    <header className="flex items-center gap-3">
      {/* Decorative: the heading beside it already names the gym. */}
      <Image
        src="/logo.jpg"
        alt=""
        width={64}
        height={64}
        loading="eager"
        className="size-16 shrink-0 rounded-2xl border border-border"
      />
      <div className="min-w-0">
        <h1 className="text-2xl leading-none font-black tracking-tight">
          SAAD <span className="text-primary">GYM</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Train Hard. Stay Consistent.</p>
      </div>
    </header>
  );
}
