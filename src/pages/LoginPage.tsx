// ============================================================
//  GreenTrail India — Login Page (Firebase + Backend)
// ============================================================

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase";
import { syncUser } from "@/lib/backendApi";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // ── Email/Password login ──────────────────────────────────
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmail(data.email, data.password);
      // Sync to backend
      await syncUser({
        name: cred.user.displayName || "",
        photoURL: cred.user.photoURL || "",
      });
      toast({ title: `Welcome back!`, description: "You are now signed in." });
      navigate("/profile");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Please check your credentials.";
      let friendly = "Sign in failed";
      if (msg.includes("user-not-found")) friendly = "No account found with this email.";
      if (msg.includes("wrong-password"))  friendly = "Incorrect password.";
      if (msg.includes("too-many-requests")) friendly = "Too many attempts. Try again later.";
      toast({ title: "Sign in failed", description: friendly, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google login ──────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const cred = await signInWithGoogle();
      await syncUser({
        name: cred.user.displayName || "",
        photoURL: cred.user.photoURL || "",
      });
      toast({ title: `Welcome, ${cred.user.displayName}!`, description: "Signed in with Google." });
      navigate("/profile");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("popup-closed")) {
        toast({ title: "Google sign-in failed", description: "Please try again.", variant: "destructive" });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
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
          <h2 className="text-5xl font-serif text-white mb-6">
            Where Every Path Leads to Discovery
          </h2>
          <p className="text-white/80 text-xl font-light max-w-md mx-auto">
            Join a community of modern naturalists exploring the untamed beauty of India.
          </p>
        </div>
      </div>

      {/* Right Panel */}
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

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 px-4 mb-6 hover:bg-muted/50 transition-colors font-medium text-sm disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              )}
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or sign in with email</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Email Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...form.register("email")}
                  className="rounded-xl"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className="rounded-xl"
                />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
