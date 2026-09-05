import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { LogOut } from "lucide-react";
import { ReflexLogo } from "./logo";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/reflex/store";
import type { Role } from "@/lib/reflex/types";
import { cn } from "@/lib/utils";

export type NavItem = { to: string; label: string };

export function RoleShell({
  role,
  nav,
  children,
}: {
  role: Role;
  nav: NavItem[];
  children: ReactNode;
}) {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (session === null || session.role !== role) {
      const id = setTimeout(() => {
        if (session === null || session.role !== role) void navigate({ to: "/", replace: true });
      }, 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [session, role, navigate]);

  if (!session || session.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link to="/">
            <ReflexLogo />
          </Link>
          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to.split("/").length === 2 }}
                activeProps={{ className: "bg-primary-soft text-primary" }}
                inactiveProps={{ className: "text-muted-foreground hover:bg-muted" }}
                className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold">{session.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{session.role}</div>
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Sign out"
              onClick={() => {
                signOut();
                void navigate({ to: "/", replace: true });
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <nav
          className={cn(
            "flex gap-1 overflow-x-auto border-t px-3 py-2 md:hidden",
            nav.length > 3 && "justify-start",
          )}
        >
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to.split("/").length === 2 }}
              activeProps={{ className: "bg-primary-soft text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-16">{children}</main>
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
