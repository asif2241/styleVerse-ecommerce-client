import PublicNavbar from "@/components/PublicNavbar";



const CommonLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {/* <MainNavbar /> */}
            <PublicNavbar></PublicNavbar>
            {children}
        </>
    );
};

export default CommonLayout;