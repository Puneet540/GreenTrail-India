// ============================================================
//  GreenTrail India — Register Page (Firebase + Backend)
// ============================================================

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase";
import { syncUser } from "@/lib/backendApi";

const registerSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm:  z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const cred = await signUpWithEmail(data.email, data.password, data.name);
      await syncUser({ name: data.name, photoURL: cred.user.photoURL || "" });
      toast({ title: `Welcome, ${data.name}!`, description: "Your account has been created." });
      navigate("/profile");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      let friendly = "Registration failed. Please try again.";
      if (msg.includes("email-already-in-use")) friendly = "An account with this email already exists.";
      if (msg.includes("weak-password")) friendly = "Please choose a stronger password.";
      toast({ title: "Registration failed", description: friendly, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const cred = await signInWithGoogle();
      await syncUser({ name: cred.user.displayName || "", photoURL: cred.user.photoURL || "" });
      toast({ title: `Welcome, ${cred.user.displayName}!`, description: "Account created with Google." });
      navigate("/profile");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("popup-closed")) {
        toast({ title: "Google sign-up failed", description: "Please try again.", variant: "destructive" });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"
            alt="Mountains"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        </div>
        <div className="relative z-10 text-center px-12">
          <h2 className="text-5xl font-serif text-white mb-6">Start Your Eco Journey</h2>
          <p className="text-white/80 text-xl font-light max-w-md mx-auto">
            Create an account and begin discovering sustainable travel across India.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <Link href="/" className="absolute top-8 left-8 text-primary font-serif italic text-xl">
          GreenTrail India
        </Link>

        <div className="w-full max-w-md">
          <div className="glass rounded-[32px] p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif text-primary mb-2">Create Your Account</h1>
              <p className="text-muted-foreground">Join thousands of eco-conscious travelers.</p>
            </div>

            <button
              onClick={handleGoogleSignUp}
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
              <span className="text-xs text-muted-foreground">or register with email</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input placeholder="Your name" {...form.register("name")} className="rounded-xl" />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input type="email" placeholder="you@example.com" {...form.register("email")} className="rounded-xl" />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <Input type="password" placeholder="Min 6 characters" {...form.register("password")} className="rounded-xl" />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                <Input type="password" placeholder="Repeat password" {...form.register("confirm")} className="rounded-xl" />
                {form.formState.errors.confirm && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.confirm.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
