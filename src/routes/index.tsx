import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, PackageSearch } from "lucide-react";
import { ReflexLogo, ReflexMark } from "@/components/reflex/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_ACCOUNTS, DEMO_PASSWORD, homeFor, signIn, useSession } from "@/lib/reflex/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reflex — Delivery management for Kenyan retailers" },
      {
        name: "description",
        content:
          "Reflex replaces WhatsApp delivery coordination: create requests, assign riders, track status and confirm delivery with proof. Every delivery. Under control.",
      },
      { property: "og:title", content: "Reflex — Every delivery. Under control." },
      {
        property: "og:description",
        content:
          "Create, assign, track and confirm deliveries in one simple system built for small Kenyan retailers.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const session = useSession();
  const [email, setEmail] = useState("dispatcher@reflex.demo");
  const [password, setPassword] = useState(DEMO_PASSWORD);

  useEffect(() => {
    if (session) void navigate({ to: homeFor(session.role), replace: true });
  }, [session, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const s = signIn(email, password);
    if (!s) {
      toast.error("Wrong email or password. Use a demo account below.");
      return;
    }
    toast.success(`Welcome back, ${s.name}`);
    void navigate({ to: homeFor(s.role) });
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="brand-gradient hidden flex-col justify-between p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <ReflexMark className="h-11 w-11 border border-white/30 bg-white/15" />
          <div>
            <div className="text-2xl font-extrabold">Reflex</div>
            <div className="text-sm opacity-90">Every delivery. Under control.</div>
          </div>
        </div>
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold">
            Create → Assign → Track → Confirm
          </h1>
          <p className="text-base opacity-90">
            One system for electronics shops, pharmacies and hardware stores. No more chasing riders
            on WhatsApp.
          </p>
          <ul className="space-y-2 text-sm opacity-90">
            <li>• Retailers raise delivery requests in seconds</li>
            <li>• Dispatchers assign riders and watch every job</li>
            <li>• Riders confirm with a customer PIN and photo</li>
            <li>• Customers track orders with an order number</li>
          </ul>
        </div>
        <p className="text-xs opacity-75">Nairobi • Kenya</p>
      </div>

      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <ReflexLogo tagline className="mb-8" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a demo account to explore the full workflow.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="card-elevated mt-6 p-4">
            <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Demo accounts — password {DEMO_PASSWORD}
            </div>
            <div className="mt-3 space-y-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(DEMO_PASSWORD);
                  }}
                  className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary-soft"
                >
                  <span>
                    <span className="font-semibold capitalize">{a.role}</span>
                    <span className="block text-xs text-muted-foreground">{a.email}</span>
                  </span>
                  <span className="text-xs font-semibold text-primary">Use</span>
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/track"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-secondary hover:underline"
          >
            <PackageSearch className="h-4 w-4" />
            Track an order without signing in
          </Link>
        </div>
      </div>
    </div>
  );
}
