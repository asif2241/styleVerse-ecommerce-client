"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Newsletter() {
    return (
        <section className="w-full bg-[#F8F8F8] py-12 px-6 border-y border-gray-100">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

                {/* TEXT CONTENT */}
                <h2 className="text-xl md:text-2xl font-light tracking-tight text-[#444] text-center md:text-left">
                    Subscribe to <span className="font-semibold text-black">StyleVerse</span>
                </h2>

                {/* FORM FIELD */}
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col sm:flex-row w-full md:w-auto max-w-md items-center gap-0 group"
                >
                    <div className="relative w-full">
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            className="h-12 mb-2 sm:mb-0 w-full sm:w-[320px] rounded-none border-gray-300 border-r-0 md:border-r-0 focus-visible:ring-0 focus-visible:border-black placeholder:italic placeholder:text-gray-400 bg-white"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="h-12  px-8 rounded-none bg-[#D10A0A] hover:bg-[#B00909] text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all w-full sm:w-auto"
                    >
                        Subscribe
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Button>
                </form>

            </div>
        </section>
    );
}