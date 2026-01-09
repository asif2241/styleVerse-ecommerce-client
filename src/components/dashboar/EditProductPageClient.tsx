/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Used below
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Used below
import MultipleImageUploader from "@/components/MultipleImageUploader";

import { useUpdateProductMutation } from "@/redux/features/product/product.api";
import { useAllCategoryQuery } from "@/redux/features/category/category.api";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { FileMetadata } from "@/hooks/use-file-upload";
import { IProduct } from "@/types/product.interface";

const GENDER = ["MEN", "WOMEN", "UNISEX"] as const;

const FormInputSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().min(1),
    discountPrice: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    brand: z.string().optional(),
    sizes: z.array(z.object({ size: z.string(), quantity: z.string() })),
    color: z.string().min(1),
    material: z.string().optional(),
    gender: z.enum(GENDER),
    sku: z.string().min(1),
});

type ProductFormValues = z.infer<typeof FormInputSchema>;

export default function EditProductFormClient({ initialProduct }: { initialProduct: IProduct }) {
    const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
    const { data: categoryData } = useAllCategoryQuery(undefined);

    // Use the initialProduct to set the initial state directly
    const [images, setImages] = useState<(File | FileMetadata)[]>(
        (initialProduct.images || []).map((url, index) => ({
            id: url, // 🔹 Add this line. Using the URL as the ID is usually best for existing files.
            url,
            name: `Existing Image ${index + 1}`,
            size: 0,
            type: "image/webp"
        }))
    );
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(FormInputSchema),
        defaultValues: {
            title: initialProduct.title,
            description: initialProduct.description,
            price: String(initialProduct.price),
            discountPrice: initialProduct.discountPrice ? String(initialProduct.discountPrice) : "",
            category: typeof initialProduct.category === 'object' ? (initialProduct.category as any)._id : initialProduct.category,
            brand: initialProduct.brand || "",
            color: initialProduct.color,
            material: initialProduct.material || "",
            gender: initialProduct.gender as any,
            sku: initialProduct.sku,
            sizes: initialProduct.sizes.map((s: any) => ({
                size: s.size,
                quantity: String(s.quantity),
            })),
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "sizes",
        control: form.control,
    });

    const handleSubmit = async (data: ProductFormValues) => {
        const toastId = toast.loading("Updating StyleVerse product...");
        const formData = new FormData();

        // 1. Filter existing URLs to keep
        const existingImageUrls = images
            .filter((img): img is FileMetadata => !(img instanceof File))
            .map(img => img.url);

        // 2. Filter new Files to upload
        const newFiles = images.filter((img): img is File => img instanceof File);

        // 3. Construct the final data payload
        const payload = {
            ...data,
            price: Number(data.price),
            discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
            images: existingImageUrls, // Tell backend which existing images to keep
            sizes: data.sizes.map(s => ({
                size: s.size,
                quantity: Number(s.quantity)
            })),
        };

        console.log(payload);

        // 4. Append to FormData
        formData.append("data", JSON.stringify(payload));

        // Append files only once
        newFiles.forEach(file => {
            formData.append("files", file);
        });

        try {
            const res = await updateProduct({ productId: initialProduct._id, formData }).unwrap();
            console.log(res);
            toast.success("Product updated successfully!", { id: toastId });
        } catch (err: any) {
            toast.error(err?.data?.message || "Update failed", { id: toastId });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 bg-white p-6 rounded-xl border">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-gray-500">Product Title</FormLabel>
                            <FormControl><Input {...field} className="rounded-none border-t-0 border-x-0 border-b focus-visible:ring-0" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="sku" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-gray-500">SKU</FormLabel>
                            <FormControl><Input {...field} className="rounded-none border-t-0 border-x-0 border-b focus-visible:ring-0" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                {/* Textarea Usage */}
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-gray-500">Description</FormLabel>
                        <FormControl><Textarea {...field} rows={4} className="focus-visible:ring-black" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-bold">Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />

                    {/* Select Usage */}
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold">Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {categoryData?.data?.map((cat: any) => (
                                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold">Gender</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {GENDER.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                </div>

                {/* Image Uploader */}
                <div className="space-y-2">
                    <FormLabel className="text-xs font-bold">Product Images</FormLabel>
                    <MultipleImageUploader defaultImages={images} onChange={setImages} />
                </div>

                {/* Sizes Array */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold">SIZES & STOCK</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ size: "", quantity: "" })}>
                            <Plus className="w-4 h-4 mr-2" /> Add Size
                        </Button>
                    </div>
                    {fields.map((item, i) => (
                        <div key={item.id} className="flex gap-4 items-end">
                            <div className="flex-1"><Input {...form.register(`sizes.${i}.size`)} placeholder="Size (e.g. L)" /></div>
                            <div className="flex-1"><Input {...form.register(`sizes.${i}.quantity`)} type="number" placeholder="Qty" /></div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(i)} disabled={fields.length === 1}><Trash2 size={16} /></Button>
                        </div>
                    ))}
                </div>

                <Button disabled={updating} type="submit" className="w-full bg-black h-12 text-white font-bold hover:bg-zinc-800">
                    {updating ? <Loader2 className="animate-spin mr-2" /> : "SAVE ALL CHANGES"}
                </Button>
            </form>
        </Form>
    );
}