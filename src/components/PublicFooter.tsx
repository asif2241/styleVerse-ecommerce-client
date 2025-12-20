// components/Footer.tsx
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Truck, Shield, FacebookIcon } from "lucide-react";

export default function PublicFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 lg:px-8">
                {/* Top Section - Brand + Newsletter */}
                <div className="text-center mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Brand & About */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white">StyleVerse</h2>
                            <p className="text-gray-400 max-w-xs">
                                Your one-stop fashion destination. Discover trendy outfits, premium quality, and express your unique style.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-400 hover:text-white transition">
                                    <FacebookIcon className="w-5 h-5" />

                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition">
                                    <Youtube className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-5 text-lg">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
                                <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
                                <li><a href="/shipping" className="hover:text-white transition">Careers</a></li>
                                <li><a href="/blog" className="hover:text-white transition">Fashion Blog</a></li>
                            </ul>
                        </div>

                        {/* Customer Care */}
                        <div>
                            <h3 className="text-white font-semibold mb-5 text-lg">Customer Care</h3>
                            <ul className="space-y-3">
                                <li><a href="/track-order" className="hover:text-white transition">Track Your Order</a></li>
                                <li><a href="/returns" className="hover:text-white transition">Returns & Exchanges</a></li>
                                <li><a href="/size-guide" className="hover:text-white transition">Size Guide</a></li>
                                <li><a href="/shipping-info" className="hover:text-white transition">Shipping Info</a></li>
                                <li><a href="/gift-cards" className="hover:text-white transition">Gift Cards</a></li>
                            </ul>
                        </div>

                        {/* Contact & Features */}
                        <div>
                            <h3 className="text-white font-semibold mb-5 text-lg">Get in Touch</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-indigo-400" />
                                    <span>support@styleverse.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-indigo-400" />
                                    <span>+880 1700-123456</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-indigo-400" />
                                    <span>Dhaka, Bangladesh</span>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-green-400" />
                                    <span>Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-green-400" />
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-green-400" />
                                    <span>Buyer Protection</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm text-gray-500">
                            © 2025 <span className="text-indigo-400 font-medium">StyleVerse</span>. All rights reserved.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="/terms" className="hover:text-white transition">Terms of Service</a>
                            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
                            <a href="/cookies" className="hover:text-white transition">Cookie Policy</a>
                            <a href="/sitemap" className="hover:text-white transition">Sitemap</a>
                        </div>

                        {/* <div className="flex gap-3">
                            <img src="/payment/visa.svg" alt="Visa" className="h-8" />
                            <img src="/payment/mastercard.svg" alt="Mastercard" className="h-8" />
                            <img src="/payment/bkash.svg" alt="bKash" className="h-8" />
                            <img src="/payment/nagad.svg" alt="Nagad" className="h-8" />
                        </div> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}