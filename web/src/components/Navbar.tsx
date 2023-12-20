"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/utils/lib";

import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { Button } from "./ui/button";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Conversations",
    href: "/docs/primitives/alert-dialog",
    description: "Manage client-project communications",
  },
  {
    title: "Tasks",
    href: "/docs/primitives/hover-card",
    description: " Organize work and get projects done",
  },
  {
    title: "Files",
    href: "/docs/primitives/progress",
    description: "Manage project files",
  },
  {
    title: "Invoices",
    href: "/docs/primitives/scroll-area",
    description: "Always get paid on time",
  },
  {
    title: "Price Quotes",
    href: "/docs/primitives/tabs",
    description: "Create price quotes that get approved fast",
  },
  {
    title: "Client Portal",
    href: "/docs/primitives/tooltip",
    description: "Keep clients in the loop",
  },
];

interface SiteHeaderProps {
  session: Session | null;
}

export default function Navbar() {
  return (
    <div className="  flex px-12 py-5">
      <Logo />
      <NavigationMenu className="justify-center">
        <NavigationMenuList className="relative">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Features</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-1 p-5 md:w-[400px] md:grid-cols-2 lg:w-[500px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Pricing
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {"What's new"}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>{" "}
      <AuthShowcase  />
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            " block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none ">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const AuthShowcase = () => {
  const router = useRouter();
  const session = useSession();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <Button
        className="hover:bg-primary hover:text-white p-5 border-primary border-2"
        variant={"outline"}
        onClick={
          session.status==="authenticated" ? () => router.push("/inbox") : () => void signIn()
        }
        disabled={session.status==="loading"}
      >
        {session.status==="authenticated" ? "Dashboard" : "Sign in"}
      </Button>
    </div>
  );
};
