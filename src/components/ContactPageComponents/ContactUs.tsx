"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // Or your preferred toast library like "react-hot-toast"
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// 1. Define the Zod Schema
const contactFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// 2. Extract the Type
type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactUs() {
    // 3. Initialize the form with Resolver
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    // 4. Handle Submit
    const onSubmit = async (data: ContactFormValues) => {
        try {
            console.log("Form Data:", data);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Show Success Toast
            toast.success("Message sent successfully! We'll get back to you soon.");

            // Reset form
            form.reset();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="max-w-[1500px] w-11/12 mx-auto py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* LEFT SIDE: FORM */}
                <div className="lg:col-span-7 xl:col-span-8">
                    <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
                    <p className="text-muted-foreground mb-8 text-sm">
                        Your email address will not be published. Required fields are marked*
                    </p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Your Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex. John Doe" {...field} className="rounded-xl h-12" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-semibold">Email *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example@gmail.com" {...field} className="rounded-xl h-12" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Subject */}
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Subject *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter Subject" {...field} className="rounded-xl h-12" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Message */}
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">Your Message *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter here.."
                                                className="min-h-[200px] rounded-2xl resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="bg-[#1d3d24] hover:bg-[#152e1b] text-white px-8 h-12 rounded-full text-base disabled:opacity-70"
                            >
                                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* RIGHT SIDE: INFO CARD */}
                <div className="lg:col-span-5 xl:col-span-4 bg-[#1d3d24] text-white p-8 md:p-12 rounded-[2.5rem] space-y-10 shadow-xl">
                    <section className="space-y-3">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <MapPin className="text-yellow-500" size={20} />
                            Address
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            8502 Preston Rd. Inglewood, Maine 98380
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Phone className="text-yellow-500" size={20} />
                            Contact
                        </h3>
                        <div className="space-y-1 text-gray-300">
                            <p>Phone : +0123-456-789</p>
                            <p>Email : example@gmail.com</p>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Clock className="text-yellow-500" size={20} />
                            Open Time
                        </h3>
                        <div className="space-y-1 text-gray-300">
                            <p>Monday - Friday : 10:00 - 20:00</p>
                            <p>Saturday - Sunday : 11:00 - 18:00</p>
                        </div>
                    </section>

                    <section className="space-y-5">
                        <h3 className="text-xl font-bold text-yellow-500">Stay Connected</h3>
                        <div className="flex flex-wrap gap-4">
                            <SocialIcon icon={<Facebook size={20} />} />
                            <SocialIcon icon={<Twitter size={20} />} />
                            <SocialIcon icon={<Instagram size={20} />} />
                            <SocialIcon icon={<Youtube size={20} />} />
                            <SocialIcon icon={<Mail size={20} />} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#eab308] hover:bg-yellow-500 transition-transform hover:scale-110 text-[#1d3d24]">
            {icon}
        </button>
    );
}