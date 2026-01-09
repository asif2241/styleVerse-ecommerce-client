/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ShieldAlert, ShieldCheck, UserCog } from "lucide-react";
import { toast } from "sonner";

import { useBlockUserMutation, useGetAllUsersQuery, useUnblockUserMutation } from "@/redux/features/user/user.api";
import { UpdateUserRole } from "./UpdateUserRole";
import { IUser } from "@/types/user.interface";
import PaginationComp from "../shared/PaginationComp";
import { UsersFilters } from "./UserFilters";

export default function UsersTable() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Search Params
    const searchEmail = searchParams.get("searchEmail") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const role = searchParams.get("role") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const page = searchParams.get("page") || "1";

    // API Hooks
    const { data, isLoading } = useGetAllUsersQuery({ searchEmail, limit, sort, page, role });
    const [blockUser] = useBlockUserMutation();
    const [unblockUser] = useUnblockUserMutation();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleAction = async (id: string, action: "BLOCK" | "UNBLOCK") => {
        const isBlock = action === "BLOCK";
        const toastId = toast.loading(`${isBlock ? "Blocking" : "Unblocking"} User...`);

        try {
            const res = isBlock
                ? await blockUser(id).unwrap()
                : await unblockUser(id).unwrap();

            if (res.success) {
                toast.success(isBlock ? "User Blocked" : "User Unblocked", { id: toastId });
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Something went wrong", { id: toastId });
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
                <UsersFilters />
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[250px]">User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">Role</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">Loading Users...</TableCell>
                            </TableRow>
                        ) : data?.data?.map((user: IUser) => (
                            <TableRow key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                                            {user.name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-900">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-600">{user.email}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="capitalize">
                                        {user?.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {user.isBlocked ? (
                                        <Badge variant="destructive" className="animate-pulse">Blocked</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />

                                            {/* Role Update Trigger (Keep your component but style the trigger) */}
                                            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                                                <UserCog className="mr-2 h-4 w-4" />
                                                <UpdateUserRole id={user._id as string} />
                                            </div>

                                            {user.isBlocked ? (
                                                <DropdownMenuItem
                                                    onClick={() => handleAction(user._id as string, "UNBLOCK")}
                                                    className="text-green-600"
                                                >
                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                    Unblock User
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    onClick={() => handleAction(user._id as string, "BLOCK")}
                                                    className="text-destructive"
                                                >
                                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                                    Block User
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-center py-4">
                <PaginationComp
                    currentPage={Number(data?.meta?.page)}
                    totalPages={data?.meta?.totalPage}
                    paginationItemsToDisplay={5}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}