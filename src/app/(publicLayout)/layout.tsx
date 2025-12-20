import PublicFooter from "@/components/PublicFooter";
import PublicNavbar from "@/components/PublicNavbar";



const CommonLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {/* <MainNavbar /> */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/75 backdrop-blur-md">
                <PublicNavbar></PublicNavbar>
            </header>
            {children}
            <PublicFooter></PublicFooter>
        </>
    );
};

export default CommonLayout;