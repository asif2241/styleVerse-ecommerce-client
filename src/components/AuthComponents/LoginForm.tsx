// "use client";
// import { loginUser } from "@/services/auth/loginUser";
// import { useActionState, useEffect } from "react";
// import { toast } from "sonner";
// import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
// import { Input } from "../ui/input";
// import InputFieldError from "../shared/InputFieldError";
// import { Button } from "../ui/button";
// import { useLoginMutation } from "@/redux/features/auth/auth.api";

// const LoginForm = ({ redirect }: { redirect?: string }) => {

//     const [login] = useLoginMutation();
//     const [state, formAction, isPending] = useActionState(loginUser, null);

//     useEffect(() => {
//         if (state && !state.success && state.message) {
//             toast.error(state.message);
//         }
//     }, [state]);

//     return (
//         <form action={formAction}>
//             {redirect && <input type="hidden" name="redirect" value={redirect} />}
//             <FieldGroup>
//                 <div className="grid grid-cols-1 gap-4">
//                     {/* Email */}
//                     <Field>
//                         <FieldLabel htmlFor="email">Email</FieldLabel>
//                         <Input
//                             id="email"
//                             name="email"
//                             type="email"
//                             placeholder="m@example.com"
//                         //   required
//                         />

//                         <InputFieldError field="email" state={state} />
//                     </Field>

//                     {/* Password */}
//                     <Field>
//                         <FieldLabel htmlFor="password">Password</FieldLabel>
//                         <Input
//                             id="password"
//                             name="password"
//                             type="password"
//                             placeholder="Enter your password"
//                         //   required
//                         />
//                         <InputFieldError field="password" state={state} />
//                     </Field>
//                 </div>
//                 <FieldGroup className="mt-4">
//                     <Field>
//                         <Button type="submit" disabled={isPending}>
//                             {isPending ? "Logging in..." : "Login"}
//                         </Button>

//                         <FieldDescription className="px-6 text-center">
//                             Don&apos;t have an account?{" "}
//                             <a href="/register" className="text-blue-600 hover:underline">
//                                 Sign up
//                             </a>
//                         </FieldDescription>
//                         <FieldDescription className="px-6 text-center">
//                             <a
//                                 href="/forgot-password"
//                                 className="text-blue-600 hover:underline"
//                             >
//                                 Forgot password?
//                             </a>
//                         </FieldDescription>
//                     </Field>
//                 </FieldGroup>
//             </FieldGroup>
//         </form>
//     );
// };

// export default LoginForm;
"use client"
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export function LoginForm({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    const router = useRouter()
    const form = useForm({
        //! For development only
        defaultValues: {
            email: "super@gmail.com",
            password: "12345678",
        },
    });
    const [login] = useLoginMutation();
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const res = await login(data).unwrap();

            if (res.success) {
                toast.success("Logged in successfully");
                router.push("/")

            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);

            if (err.data.message === "Password does not match") {
                toast.error("Invalid credentials");
            }


        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john@example.com"
                                            {...field}
                                            value={field.value || ""}
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </Form>


            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href={"/register"} replace className="underline underline-offset-4">
                    Register
                </Link>
            </div>
        </div>
    );
}