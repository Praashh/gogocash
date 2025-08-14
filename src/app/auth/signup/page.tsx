"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const result = await response.data;
      console.log(result)

      if (response.status !== 201) {
        throw new Error(result.error || 'Registration failed');
      }

      toast.success('Registration successful');
      router.push('/auth/signin?message=Registration successful! Please sign in.');
      
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#031416] to-black" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_center,rgba(45,212,191,0.15),transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 border-teal-400 text-teal-400 font-bold mb-4" aria-label="GoGoCash logo">G</div>
            <h1 className="text-2xl font-bold">GoGoCash</h1>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-[radial-gradient(420px_200px_at_center,rgba(45,212,191,0.18),transparent_70%)] blur-2xl" />
            <Card className="relative rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,14,0.88),rgba(8,17,17,0.76))] backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_40px_80px_-20px_rgba(0,0,0,0.6)]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white tracking-tight">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Join us and start managing your finances today
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          autoComplete="name"
                          className="h-12 rounded-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 px-5 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          autoComplete="email"
                          className="h-12 rounded-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 px-5 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password"
                          autoComplete="new-password"
                          className="h-12 rounded-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 px-5 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-semibold py-3 shadow-[0_12px_30px_rgba(45,212,191,0.45)] hover:from-teal-300 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading ? "Creating Account..." : "Get Started"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link 
                  href="/auth/signin" 
                  className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  </div>
  );
}