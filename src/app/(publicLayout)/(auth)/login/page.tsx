import { LoginForm } from "@/components/AuthComponents/LoginForm";
import { Suspense } from "react";

const LoginPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ redirect?: string }>;
}) => {
    const params = (await searchParams) || {};
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-6 rounded-lg  p-8 ">
                {/* <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-gray-500">
                        Enter your credentials to access your account
                    </p>
                </div> */}
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
};

export default LoginPage;