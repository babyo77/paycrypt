import { Logo } from "@/components/logo";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const links = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "Security",
    href: "#security",
  },
  {
    title: "Solutions",
    href: "#solutions",
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    title: "Terms of Service",
    href: "/terms-of-service",
  },
];

export default function FooterSection() {
  return (
    <footer className="py-12">
      <div className="mx-auto max-w-8xl px-6 space-y-5 font-medium">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <Logo />
        </Link>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-primary block duration-150"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="https://x.com/paycrypt_tech">
            <FaXTwitter className="size-5 text-muted-foreground hover:text-foreground" />
          </Link>
          <Link href="https://discord.gg/7A87VRZn6U">
            <FaDiscord className="size-6 text-muted-foreground hover:text-foreground" />
          </Link>
        </div>
        <span className="text-muted-foreground block text-center text-sm">
          © {new Date().getFullYear()} Paycrypt, All rights reserved
        </span>
      </div>
    </footer>
  );
}
