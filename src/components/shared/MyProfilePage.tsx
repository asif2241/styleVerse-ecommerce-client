"use client";

import {
    User,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Edit3,
    Camera,
    Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetMeQuery } from "@/redux/features/user/user.api";
import Link from "next/link";
import ProfilePageSkeleton from "./skeletons/ProfilePageSkeleton";
import { Role } from "@/types/user.interface";

export default function MyProfilePage() {
    const { data, isLoading } = useGetMeQuery(undefined);

    if (isLoading) return <ProfilePageSkeleton></ProfilePageSkeleton>

    const user = data?.data;

    // Split name for visual layout
    const nameParts = user?.name.split(" ");
    const firstName = nameParts?.[0] || "";
    const lastName = nameParts?.slice(1).join(" ") || "";

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Profile</h1>
                <Link href={user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN ? `/admin/dashboard/edit-profile` : `edit-profile`} className="gap-2 bg-white text-zinc-900 flex justify-center items-center border shadow-sm hover:bg-zinc-50 rounded-sm px-5">
                    <Edit3 size={16} /> Edit
                </Link>
            </div>

            {/* 1. Identity Card */}
            <Card className="border shadow-sm overflow-hidden bg-white">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow-xl">
                                <AvatarImage src={user?.profileImage} alt={user?.name} className="object-cover" />
                                <AvatarFallback className="text-3xl bg-zinc-100 text-zinc-400 font-bold">
                                    {user?.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <button className="absolute bottom-1 right-1 bg-zinc-900 p-2 rounded-full shadow-lg text-white hover:scale-110 transition-transform">
                                <Camera size={14} />
                            </button>
                        </div>

                        <div className="text-center md:text-left space-y-3">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-zinc-500 font-medium">{user?.role}</p>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400">
                                <MapPin size={14} />
                                <span>{user?.address || "Location not set"}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Detailed Information Card */}
            <Card className="border shadow-sm bg-white">
                <CardHeader className="px-8 pt-8">
                    <CardTitle className="text-xl font-bold text-gray-900">Personal information</CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">

                    <InfoItem icon={<User size={16} />} label="First Name" value={firstName} />
                    <InfoItem icon={<User size={16} />} label="Last Name" value={lastName} />

                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-400">Email Address</p>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-50 rounded-md text-zinc-500"><Mail size={16} /></div>
                            <div>
                                <p className="text-gray-900 font-semibold">{user?.email}</p>
                                {user?.isVerified && <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 uppercase tracking-tighter"><ShieldCheck size={10} /> Verified</span>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-400">Phone</p>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-50 rounded-md text-zinc-500"><Phone size={16} /></div>
                            <p className="text-gray-900 font-semibold">{user?.phone || "Not Provided"}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-400">Role</p>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-50 rounded-md text-zinc-500"><Briefcase size={16} /></div>
                            <p className="text-gray-900 font-semibold">{user?.role}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-400">Account Status</p>
                        <div className="flex items-center gap-2">
                            <Badge className={`rounded-full px-4 ${user?.isActive === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${user?.isActive === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}`} />
                                {user?.isActive}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Address Card */}
            <Card className="border shadow-sm bg-white">
                <CardHeader className="px-8 pt-8">
                    <CardTitle className="text-xl font-bold text-gray-900">Address</CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-400">Country</p>
                        <p className="text-gray-900 font-semibold">Bangladesh</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-400">City/State</p>
                        <p className="text-gray-900 font-semibold">{user?.address?.split(',').slice(-2).join(',').trim() || "Not Set"}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-400">{label}</p>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-50 rounded-md text-zinc-500">{icon}</div>
                <p className="text-gray-900 font-semibold">{value || "N/A"}</p>
            </div>
        </div>
    );
}