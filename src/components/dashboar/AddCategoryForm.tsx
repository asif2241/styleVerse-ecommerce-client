/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, FolderTree } from "lucide-react";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { categoryFormSchema, CategoryFormValues } from "@/types/categorySchema";
import { useAddCategoryMutation, useAllCategoryQuery } from "@/redux/features/category/category.api";

export default function CreateCategoryForm() {
    // Fetch existing categories to populate the "Parent" dropdown
    const { data: categoriesData, isLoading: fetchingCats } = useAllCategoryQuery(undefined);
    const [createCategory, { isLoading }] = useAddCategoryMutation();

    const form = useForm({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: "",
            parent: undefined,
            isActive: true,
        },
    });

    const onSubmit = async (values: CategoryFormValues) => {
        try {
            // If parent is empty string, we send undefined so Mongoose handles it as null
            const payload = {
                ...values,
                parent: values.parent === "" ? undefined : values.parent,
            };

            await createCategory(payload).unwrap();
            toast.success("Category created successfully!");
            form.reset();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create category");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-black rounded-lg">
                    <FolderTree className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Category</h1>
                    <p className="text-sm text-muted-foreground">Add a new category or sub-category to StyleVerse.</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border p-8 rounded-2xl bg-white shadow-sm">

                    {/* CATEGORY NAME */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Category Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. OUTERWEAR" className="rounded-none focus-visible:ring-black" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* PARENT CATEGORY */}
                    <FormField
                        control={form.control}
                        name="parent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Parent Category (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-none focus:ring-black w-full">
                                            <SelectValue placeholder="Select a parent category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* Change value from "" to "none" */}
                                        <SelectItem value="none">None (Main Category)</SelectItem>

                                        {categoriesData?.data?.map((cat: any) => (
                                            <SelectItem key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Leave empty to create a top-level category.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* IS ACTIVE SWITCH
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-semibold">Active Status</FormLabel>
                                    <FormDescription>
                                        Disable this to hide the category from the store.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    /> */}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-none bg-black hover:bg-zinc-800 text-white font-bold transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        CREATE CATEGORY
                    </Button>
                </form>
            </Form>
        </div>
    );
}