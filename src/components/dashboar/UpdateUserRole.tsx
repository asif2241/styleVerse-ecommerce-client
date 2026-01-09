/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetSingleUserQuery, useUpdateUserMutation } from "@/redux/features/user/user.api";
import { isActive, Role } from "@/types/user.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Fix the zod schema - use Object.values to get array of statuses
const updateUserRoleSchema = z.object({
    role: z.enum([Object.values(Role)[0], ...Object.values(Role).slice(1)] as [string, ...string[]]),
    isActive: z.enum([Object.values(isActive)[0], ...Object.values(isActive).slice(1)] as [string, ...string[]]),

})
type UpdateUserRoleForm = z.infer<typeof updateUserRoleSchema>;



export function UpdateUserRole({ id }: { id: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [updateUserRole] = useUpdateUserMutation()

    // Only fetch when dialog is open
    const { data: userData } = useGetSingleUserQuery(id, {
        skip: !id || !isDialogOpen,
    });

    // console.log(id);
    const form = useForm<UpdateUserRoleForm>({
        resolver: zodResolver(updateUserRoleSchema),
        defaultValues: {
            role: "",
            isActive: "",

        }
    });

    //useEffet for setting privious valus as default value in the input field 
    useEffect(() => {
        if (userData?.data && isDialogOpen) {
            const user = userData.data;
            form.reset({
                role: user.role,
                isActive: user.isActive
            });
        }
    }, [userData, form, isDialogOpen]);

    const handleDialogOpen = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            form.reset(); // Reset form when dialog closes
        }
    };


    const onSubmit = async (data: UpdateUserRoleForm) => {
        console.log("Parcel ID:", id, typeof id);
        console.log("Form data:", data);

        try {
            const res = await updateUserRole({ id, ...data }).unwrap();
            console.log(res);
            if (res.success) {
                toast.success("User updated successfully");
                form.reset();
                setIsDialogOpen(false)
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to Update User")
        }

    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
                <Button>Update User</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[300px]">
                <DialogHeader>
                    <DialogTitle>Update User Role and Active Status</DialogTitle>
                    <DialogDescription>
                        Update the role and statuses of the user.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form id="update-user" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Role Field */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a Role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.entries(Role).map(([_, value]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Active status Field */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Active Statuses" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.entries(isActive).map(([_, value]) => (
                                                    <SelectItem key={value} value={value}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </form>
                </Form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form="update-user">
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}