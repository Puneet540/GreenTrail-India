import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        toast({ title: "Sign in failed", description: body.error || "Please check your credentials.", variant: "destructive" });
        return;
      }
      toast({ title: `Welcome back, ${body.name}!`, description: "You are now signed in." });
      navigate("/profile");
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80"
            alt="Forest path"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        </div>
        <div className="relative z-10 text-center px-12">
          <h2 className="text-5xl font-serif text-white mb-6">Where Every Path Leads to Discovery</h2>
          <p className="text-white/80 text-xl font-light max-w-md mx-auto">
            Join a community of modern naturalists exploring the untamed beauty of India.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <Link href="/" className="absolute top-8 left-8 text-primary font-serif italic text-xl">
          GreenTrail India
        </Link>

        <div className="w-full max-w-md">
          <div className="glass rounded-[32px] p-8 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-serif text-primary mb-2">Welcome Back to Nature</h1>
              <p className="text-muted-foreground">Sign in to continue your journey.</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Email</label>
                <Input
                  {...form.register("email")}
                  type="email"
                  data-testid="input-email"
                  className="rounded-xl bg-white/60 h-12"
                  placeholder="wanderer@example.com"
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground/80">Password</label>
                </div>
                <Input
                  {...form.register("password")}
                  type="password"
                  data-testid="input-password"
                  className="rounded-xl bg-white/60 h-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {form.formState.errors.password && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                data-testid="button-signin"
                className="btn-primary w-full py-4 text-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                Sign In
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
