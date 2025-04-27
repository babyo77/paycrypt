"use client";
import Link from "next/link";
import { Logo } from "./logo";
import {
  Menu,
  X,
  CreditCard,
  Globe,
  Code,
  Coins,
  DollarSign,
  File,
  ShoppingCart,
  Building,
  BarChart3,
  Mail,
  Calendar,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const menuItems = [
  { name: "Products", href: "#products" },
  { name: "Solutions", href: "#solutions" },
  { name: "Developers", href: "#developers" },
  { name: "Pricing", href: "#pricing" },
];

// Product dropdown items
const products = [
  {
    name: "Payment Gateway",
    description: "Accept crypto payments with our no-code checkout solution",
    href: "#payment-gateway",
    icon: <CreditCard className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Smart Payment Links",
    description: "Create one-use, expiring, and token-gated payment links",
    href: "#smart-payment-links",
    icon: <Link2 className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Merchant Dashboard",
    description:
      "Real-time analytics, transaction history, and payout summaries",
    href: "#merchant-dashboard",
    icon: <BarChart3 className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Multi-Chain Support",
    description:
      "Accept USDT/USDC on Ethereum, Tron, Solana, Polygon, and Arbitrum",
    href: "#multi-chain-support",
    icon: <Coins className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Refunds Engine",
    description: "Automatic handling of failed, partial, and delayed payments",
    href: "#refunds-engine",
    icon: <File className="size-5 mr-2 text-primary" />,
  },
  {
    name: "No-KYC Transactions",
    description: "Accept payments up to $1,000/day without KYC requirements",
    href: "#no-kyc",
    icon: <ShoppingCart className="size-5 mr-2 text-primary" />,
  },
];

// Solutions dropdown items
const solutions = [
  {
    name: "For Entrepreneurs",
    description: "Plug-and-play payment infrastructure for small businesses",
    href: "#entrepreneurs",
    icon: <Globe className="size-5 mr-2 text-primary" />,
  },
  {
    name: "For Freelancers",
    description:
      "Accept global payments without borders or banking restrictions",
    href: "#freelancers",
    icon: <Building className="size-5 mr-2 text-primary" />,
  },
  {
    name: "For E-commerce",
    description: "Integrate crypto payments into your online store",
    href: "#ecommerce",
    icon: <ShoppingCart className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Emerging Markets",
    description:
      "Solutions designed for businesses in regions with limited banking access",
    href: "#emerging-markets",
    icon: <Globe className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Coming Soon: Fiat Off-Ramp",
    description: "Seamlessly convert crypto to fiat with our upcoming solution",
    href: "#fiat-off-ramp",
    icon: <DollarSign className="size-5 mr-2 text-primary" />,
  },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full text-black "
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-white max-w-5xl rounded-2xl backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className="m-auto size-6 duration-200"
                  data-state={menuState ? "active" : ""}
                />
                <X
                  className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200"
                  data-state={menuState ? "active" : ""}
                />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <NavigationMenu>
                <NavigationMenuList className="bg-transparent">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid grid-cols-2 w-[550px] gap-3 p-6">
                        {products.map((product, index) => (
                          <Link
                            key={index}
                            href={product.href}
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center justify-start mb-1">
                              {product.icon}
                              {product.name}
                            </div>
                            {product.description && (
                              <p className="text-xs leading-tight text-muted-foreground pl-7 line-clamp-1">
                                {product.description}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      Solutions
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid grid-cols-2 w-[550px] gap-3 p-6">
                        {solutions.map((solution, index) => (
                          <Link
                            key={index}
                            href={solution.href}
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center justify-start mb-1">
                              {solution.icon}
                              {solution.name}
                            </div>
                            {solution.description && (
                              <p className="text-xs leading-tight text-muted-foreground pl-7 line-clamp-1">
                                {solution.description}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {menuItems.slice(2).map((item, index) => (
                    <NavigationMenuItem key={index}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent"
                          )}
                        >
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div
              className="hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent"
              data-state={menuState ? "active" : ""}
            >
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-black hover:text-gray-200 block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Link href="https://discord.gg/UCqEx8SuZf">
                  <Button size="sm">Join Waitlist</Button>
                </Link>
                {/* <Link href="https://discord.gg/UCqEx8SuZf">
                  <Button size="sm" variant="outline">
                    Contact Sales
                  </Button>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
