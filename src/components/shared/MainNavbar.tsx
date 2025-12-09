"use client"
import { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ShoppingCartIcon from '../ShopingCartIcon';

const MainNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Men', href: '/men' },
        { name: 'Women', href: '/women' },
        { name: 'Accessories', href: '/accessories' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className="border-b bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        {/* <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div> */}
                        <span className="text-xl font-bold text-gray-900">StyleVerse</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Icon */}
                        <Button variant="ghost" size="icon" className="hidden sm:flex">
                            <Search className="h-5 w-5 text-gray-700" />
                        </Button>

                        {/* Cart */}
                        <ShoppingCartIcon></ShoppingCartIcon>

                        {/* Avatar */}
                        {/* <Avatar className="h-10 w-10 border-2 border-teal-600">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar> */}
                        <Button className=''>login</Button>

                        {/* Mobile Menu Button */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetTitle className='hidden'>
                                    Mobile Menu
                                </SheetTitle>
                                <div className="flex flex-col gap-6 mt-8">
                                    {/* Mobile Navigation Links */}
                                    <div className="flex flex-col gap-4">
                                        {navLinks.map((link) => (
                                            <a
                                                key={link.name}
                                                href={link.href}
                                                className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {link.name}
                                            </a>
                                        ))}
                                        <Button>login</Button>

                                    </div>

                                    {/* Mobile Actions */}
                                    <div className="flex flex-col gap-3 pt-4 border-t">
                                        <Button variant="outline" className="w-full justify-start gap-2">
                                            <Search className="h-5 w-5" />
                                            Search
                                        </Button>
                                        <ShoppingCartIcon></ShoppingCartIcon>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MainNavbar;