/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useGetMeQuery, useUpdateUserMutation } from "@/redux/features/user/user.api";
import SingleImageUploader from "../SingleImageUploader";
import { IUser } from "@/types/user.interface";
import { useRouter } from "next/navigation";
import ProfilePageSkeleton from "./skeletons/ProfilePageSkeleton";

interface ImageMetadata {
    url: string;
    isExisting: boolean;
}

const profileSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email(),
    phone: z.string().min(10, "Valid phone required"),
    address: z.string().min(5, "Address is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePageClient() {
    const [image, setImage] = useState<File | ImageMetadata | null>(null);
    const router = useRouter()

    const { data, isLoading: isUserLoading } = useGetMeQuery(undefined);
    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserMutation();

    const user: IUser = data?.data;

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: "", email: "", phone: "", address: "" },
    });



    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
            });

            if (user.profileImage && !image) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setImage({ url: user.profileImage, isExisting: true });
            }
        }
    }, [user, form]);

    const handleSubmit = async (values: ProfileFormValues) => {
        const toastId = toast.loading("Updating your StyleVerse profile...");
        const formData = new FormData();

        const { email, ...updateData } = values;

        const payload = {
            ...updateData,
            ...(image && !(image instanceof File) ? { profileImage: image.url } : {})
        };
        formData.append("data", JSON.stringify(payload));
        if (image instanceof File) {
            formData.append("file", image);
        }

        try {
            // IMPORTANT: Ensure keys match your mutation ({ id, formData })
            await updateProfile({
                id: user._id,
                formData
            }).unwrap();
            toast.success("Profile updated successfully!", { id: toastId });
            router.push("profile")

        } catch (err: any) {
            console.error("Update Error:", err);
            toast.error(err?.data?.message || "Failed to update profile", { id: toastId });
        }
    };

    if (isUserLoading) return <ProfilePageSkeleton />

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-zinc-900">Edit Profile</h1>
                <p className="text-zinc-500">Update your personal details and identity.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Image Upload Section */}
                <div className="lg:col-span-4 flex flex-col items-center space-y-6">
                    <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-zinc-100 bg-zinc-50 shadow-sm flex items-center justify-center">
                        {user.profileImage ? (
                            <Image
                                src={user.profileImage}
                                alt="Profile"
                                fill
                                className="object-cover"
                                priority
                                unoptimized={image instanceof File}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-zinc-400">
                                <User size={64} strokeWidth={1.5} />
                                <span className="text-[10px] font-bold mt-1">NO PHOTO</span>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-[240px]">
                        <label className="text-center block mb-3 text-xs font-bold uppercase text-zinc-500">
                            Change Profile Photo
                        </label>
                        <SingleImageUploader onChange={setImage} />
                    </div>
                </div>

                {/* Right: Form Fields Section */}
                <div className="lg:col-span-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl><Input {...field} placeholder="John Doe" className="h-12 rounded-xl" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email (Immutable)</FormLabel>
                                            <FormControl><Input {...field} disabled className="h-12 rounded-xl bg-zinc-50" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl><Input {...field} placeholder="+880..." className="h-12 rounded-xl" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl><Input {...field} placeholder="Street, City, Country" className="h-12 rounded-xl" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end pt-4">
                                <Button
                                    disabled={isUpdating}
                                    type="submit"
                                    className="bg-black md:max-w-[184px] w-full text-white hover:bg-zinc-800 h-12 px-12 rounded-full transition-all"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                            SAVING...
                                        </>
                                    ) : "SAVE PROFILE"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}