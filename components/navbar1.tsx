"use client";

import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "/alumniLogo.png",
    src: "/alumniLogo.png",
    alt: "Logo Image",
    title: "Regent Heights Academy",
  },
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Products",
      url: "#",
    },
    {
      title: "Resources",
      url: "#",
    },
    {
      title: "Admin",
      url: "/admin",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/register" },
  },
}: Navbar1Props) => {
  const [navBg, setNavBg] = useState(false);

  useEffect(function () {
    const handler = () => {
      if (window.scrollY > 90) setNavBg(true);
      if (window.scrollY < 90) setNavBg(false);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch auth user + profile
  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return; // not logged in

      const userId = session.user.id;

      // get name from public.users
      const { data } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", userId)
        .single();

      setCurrentUser(data?.first_name ?? null);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <section className="relative py-10">
      <div
        className={`fixed top-4 left-0 w-full h-[6vh] z-10000 transition-all duration-200
      ${navBg ? "bg-[#efbec673] shadow-md" : "bg-transparent"}
    `}
      >
        <div className="max-w-full mx-auto px-4">
          {/* Desktop Menu */}
          <nav className="hidden items-center justify-between over lg:flex">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <a href={logo.url} className="flex items-center gap-2">
                <img
                  src={logo.src}
                  className="max-h-8 dark:invert"
                  alt={logo.alt}
                />
                <span className="text-lg font-semibold tracking-tighter">
                  {logo.title}
                </span>
              </a>
              <div className="flex items-center">
                <NavigationMenu>
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            {/* <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:bg-[#41CC00] bg-transparent "
              >
                <p> {auth.login.title}</p>
              </Button>

              <Button asChild size="sm">
                <Link href="/register">{auth.signup.title}</Link>
              </Button>
            </div> */}
            <div className="flex gap-2">
              {!currentUser ? (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hover:bg-[#41CC00] bg-transparent "
                  >
                    <Link href="/login">{auth.login.title}</Link>
                  </Button>

                  <Button asChild size="sm">
                    <Link href="/register">{auth.signup.title}</Link>
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm font-semibold">
                    Welcome, {currentUser}
                  </p>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a href={logo.url} className="flex items-center gap-2">
                <img
                  src={logo.src}
                  className="max-h-8 dark:invert"
                  alt={logo.alt}
                />
              </a>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2">
                        <img
                          src={logo.src}
                          className="max-h-8 dark:invert"
                          alt={logo.alt}
                        />
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                    <div className="flex gap-2">
                      {!currentUser ? (
                        <>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="hover:bg-[#41CC00] bg-transparent "
                          >
                            <Link href="/login">{auth.login.title}</Link>
                          </Button>

                          <Button asChild size="sm">
                            <Link href="/register">{auth.signup.title}</Link>
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-sm font-semibold">
                            Welcome, {currentUser}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80 ">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="bg-transparent hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="hover:bg-muted hover:text-accent-foreground flex min-w-80 select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar1 };
