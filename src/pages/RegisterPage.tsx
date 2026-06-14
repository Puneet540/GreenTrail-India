import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast({ title: "Registration failed", description: body.error || "Please try again.", variant: "destructive" });
        return;
      }
      toast({ title: `Welcome to GreenTrail, ${body.name}!`, description: "Your account has been created." });
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
            style={{ transform: "scaleX(-1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        </div>
        <div className="relative z-10 text-center px-12">
          <h2 className="text-5xl font-serif text-white mb-6">Leave Only Footprints</h2>
          <p className="text-white/80 text-xl font-light max-w-md mx-auto">
            Create an account to start bookmarking destinations and sharing your stories.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-background relative py-12">
        <Link href="/" className="absolute top-8 left-8 text-primary font-serif italic text-xl">
          GreenTrail India
        </Link>

        <div className="w-full max-w-md mt-12 md:mt-0">
          <div className="glass rounded-[32px] p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif text-primary mb-2">Join the Trail</h1>
              <p className="text-muted-foreground">Start your nature journal today.</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Full Name</label>
                <Input
                  {...form.register("name")}
                  className="rounded-xl bg-white/60 h-12"
                  placeholder="Jane Doe"
                  disabled={isLoading}
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Email</label>
                <Input
                  {...form.register("email")}
                  type="email"
                  className="rounded-xl bg-white/60 h-12"
                  placeholder="wanderer@example.com"
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Password</label>
                <Input
                  {...form.register("password")}
                  type="password"
                  className="rounded-xl bg-white/60 h-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {form.formState.errors.password && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Confirm Password</label>
                <Input
                  {...form.register("confirmPassword")}
                  type="password"
                  className="rounded-xl bg-white/60 h-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-destructive text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-4 text-lg mt-6 flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                Create Account
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-muted-foreground">
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
