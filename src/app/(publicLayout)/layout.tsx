import PublicFooter from "@/components/PublicFooter";
import PublicNavbar from "@/components/PublicNavbar";
import { Suspense } from "react";



const CommonLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {/* <MainNavbar /> */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/75 backdrop-blur-md">
                <Suspense fallback={<div className="h-16 w-full" />}>
                    <PublicNavbar />
                </Suspense>
            </header>
            {children}
            <PublicFooter></PublicFooter>
        </>
    );
};

export default CommonLayout;