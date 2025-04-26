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
  { name: "About", href: "#about" },
];

// Product dropdown items
const products = [
  {
    name: "Payment Gateway",
    description:
      "Accept Crypto and fiat payment from single checkout interface",
    href: "#payment-gateway",
    icon: <CreditCard className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Universal Checkout",
    href: "#universal-checkout",
    icon: <Coins className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Payment Link",
    href: "#payment-link",
    icon: <Link2 className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Crypto Subscription",
    href: "#crypto-subscription",
    icon: <DollarSign className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Invoices",
    href: "#invoices",
    icon: <File className="size-5 mr-2 text-primary" />,
  },
  {
    name: "E-commerce Integrations",
    href: "#ecommerce-integrations",
    icon: <ShoppingCart className="size-5 mr-2 text-primary" />,
  },
];

// Solutions dropdown items
const solutions = [
  {
    name: "Global Payout",
    description:
      "Send funds to your vendors, contractors and employees in real time to 50+ countries",
    href: "#global-payout",
    icon: <Globe className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Crypto to Bank",
    href: "#crypto-to-bank",
    icon: <Building className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Bulk Payments",
    href: "#bulk-payments",
    icon: <BarChart3 className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Send payment to email",
    href: "#send-payment-email",
    icon: <Mail className="size-5 mr-2 text-primary" />,
  },
  {
    name: "Schedule Payments",
    href: "#schedule-payments",
    icon: <Calendar className="size-5 mr-2 text-primary" />,
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
                      <div className="grid w-[500px] gap-3 p-4">
                        {products.map((product, index) => (
                          <Link
                            key={index}
                            href={product.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              {product.icon}
                              {product.name}
                            </div>
                            {product.description && (
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground ml-7">
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
                      <div className="grid w-[500px] gap-3 p-4">
                        {solutions.map((solution, index) => (
                          <Link
                            key={index}
                            href={solution.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none flex items-center">
                              {solution.icon}
                              {solution.name}
                            </div>
                            {solution.description && (
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground ml-7">
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
                <Link href="https://app.paycrypt.tech/account">
                  <Button size="sm">Get Started</Button>
                </Link>
                <Link href="https://discord.gg/UCqEx8SuZf">
                  <Button size="sm" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
