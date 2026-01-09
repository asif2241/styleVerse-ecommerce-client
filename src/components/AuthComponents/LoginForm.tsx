/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";

// Validation Schema
const loginSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "super@gmail.com", // Development default
            password: "12345678",    // Development default
        },
    });

    const onSubmit = async (data: LoginValues) => {
        const toastId = toast.loading("Authenticating...");
        try {
            const res = await login(data).unwrap();

            if (res.success) {
                toast.success("Welcome back!", { id: toastId });
                router.push("/");
            }
        } catch (err: any) {
            console.error(err);
            const errorMessage = err?.data?.message === "Password does not match"
                ? "Invalid credentials"
                : err?.data?.message || "Login failed";

            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Login to your account</h1>
                <p className="text-sm text-gray-500">
                    Enter your details below to access your dashboard.
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 bg-white p-8 rounded-xl border shadow-sm"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-gray-500">
                                    Email Address
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="john@example.com"
                                        {...field}
                                        className="rounded-none border-t-0 border-x-0 border-b focus-visible:ring-0 px-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-gray-500">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        {...field}
                                        className="rounded-none border-t-0 border-x-0 border-b focus-visible:ring-0 px-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-black h-12 text-white font-bold hover:bg-zinc-800 transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin mr-2" />
                        ) : (
                            "LOGIN TO STYLEVERSE"
                        )}
                    </Button>

                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="underline underline-offset-4 font-medium hover:text-black transition-colors"
                        >
                            Register
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    );
}