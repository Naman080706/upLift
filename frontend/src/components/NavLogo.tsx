import Link from "next/link";
import Image from "next/image";

export function NavLogo() {
  return (
    <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
      {/* Full brand name logo */}
      <Image
        src="/Logo2_Dark.png"
        alt="upLIFT"
        width={100}
        height={28}
        className="h-7 w-auto object-contain"
        style={{ width: "auto" }}
        priority
      />
    </Link>
  );
}
