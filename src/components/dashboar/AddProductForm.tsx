/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils"; // Assuming this is correct

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
// Assuming this path is correct for your mock data
import { useAddProductMutation } from "@/redux/features/product/product.api";
import { useAllCategoryQuery } from "@/redux/features/category/category.api";
import { Category } from "@/types";


// --- Custom Interfaces & Enums (Matches your Mongoose schema) ---
const GENDER = ["MEN", "WOMEN", "UNISEX"] as const;

// 1. UPDATED CategoryOption structure for better lookup
interface CategoryOption {
  value: string; // The unique path: e.g., "MEN/SHIRT" or "KIDS"
  label: string; // The display label: e.g., "MEN / SHIRT"
  id: string;    // The actual category _id (for optional use)
  name: string;  // The final category name: e.g., "SHIRT" or "KIDS"
}

// 2. UPDATED Flattening Logic
const flattenCategories = (categories: Category[]): CategoryOption[] => {
  const options: CategoryOption[] = [];

  categories?.forEach(parent => {
    // Handle Primary Categories (e.g., KIDS) that have no children but are selectable
    if (parent.children.length === 0) {
      options.push({
        value: parent.name, // "KIDS"
        label: parent.name,
        id: parent._id,
        name: parent.name,
      });
    }

    // Handle Child Categories (e.g., SHIRT)
    parent.children.forEach(child => {
      options.push({
        value: `${parent.name}/${child.name}`, // "MEN/SHIRT"
        label: `${parent.name} / ${child.name}`,
        id: child._id, // The ID of the final category (SHIRT)
        name: child.name, // The name of the final category (SHIRT)
      });
    });
  });

  return options;
};


// --- Zod Schemas ---

// 3. Form Input Schema (Fields that come from <Input> or <Select> are treated as strings)
const FormInputSchema = z.object({
  title: z.string().min(1, "Product Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  discountPrice: z.string().optional(),
  category: z.string().min(1, "Category is required"), // Holds the unique path string (e.g., "MEN/SHIRT")
  brand: z.string().optional(),
  sizes: z.array(z.object({
    size: z.string().min(1, "Size is required"),
    quantity: z.string().min(1, "Quantity is required"), // String
  })).min(1, "At least one size variant is required"),
  color: z.string().min(1, "Color is required"),
  material: z.string().optional(),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"], { error: "Invalid Role Type" }),
  sku: z.string().min(1, "SKU is required"),
});

type FormInputValues = z.infer<typeof FormInputSchema>; // Type for useForm input


// 4. Product Data Schema (Validation and transformation to final types)
const ProductDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0.01, "Price must be greater than 0")
  ),
  discountPrice: z.union([
    z.preprocess(
      (a) => parseFloat(z.string().parse(a)),
      z.number().min(0, "Discount must be non-negative")
    ),
    z.literal(""),
  ]).optional(),
  category: z.string().min(1, "Category is required"), // Will hold the NAME in handle submit
  brand: z.string().optional(),
  sizes: z.array(z.object({
    size: z.string().min(1, "Size is required"),
    quantity: z.preprocess(
      (a) => parseInt(z.string().parse(a), 10),
      z.number().min(0, "Quantity must be non-negative")
    ),
  })).min(1, "At least one size variant is required"),
  color: z.string().min(1, "Color is required"),
  material: z.string().optional(),
  gender: z.enum(GENDER),
  sku: z.string().min(1, "SKU is required"),
});

// Using FormInputValues for the generic type in useForm
type ProductFormValues = FormInputValues;


// --- Main Component ---
export default function AddProductForm() {
  const [images, setImages] = useState<(File | FileMetadata)[] | []>([]);

  const [addProduct, { isLoading: isAddingProduct }] = useAddProductMutation();
  const { data: categoryData } = useAllCategoryQuery(undefined);
  const categories: Category[] = categoryData?.data


  const categoryOptions = flattenCategories(categories);

  // Use FormInputValues as the generic type to fix the RHF/Zod validation error
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(FormInputSchema), // Use the input schema for RHF validation
    defaultValues: {
      // Note: price and quantity default values must be strings here.
      title: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "", // Will hold the unique path (e.g., "MEN/SHIRT")
      brand: "",
      sizes: [
        { size: "", quantity: "" }, // Quantity as string
      ],
      color: "",
      material: "",
      gender: "MEN", // Default gender to avoid error
      sku: "",
    },
  });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  const handleSubmit = async (data: ProductFormValues) => {
    const toastId = toast.loading("Creating product....");
    if (images.length === 0) {
      toast.error("Please add some images", { id: toastId });
      return;
    }

    // 5. LOOKUP CATEGORY DATA using the unique path (e.g., "MEN/SHIRT")
    const selectedCategoryOption = categoryOptions.find(opt => opt.value === data.category);

    if (!selectedCategoryOption) {
      toast.error("Invalid category selected.", { id: toastId });
      return;
    }

    // 6. Prepare data for API submission, performing string-to-number conversion
    const productData = {
      ...data,
      // Convert string inputs to numbers
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,

      // --- CRITICAL CHANGE: Use the category NAME as the final value ---
      category: selectedCategoryOption.name, // Sends "SHIRT" or "KIDS"
      // You can optionally include the ID if needed for the backend:
      // categoryId: selectedCategoryOption.id, 

      // Convert size strings to numbers and add isInStock flag
      sizes: data.sizes.map(sizeItem => {
        const quantity = Number(sizeItem.quantity);
        return {
          ...sizeItem,
          quantity: quantity,
          isInStock: quantity > 0,
        };
      }),
    };
    console.log(productData);
    // API Call Preparation
    const formData = new FormData();
    formData.append("data", JSON.stringify(productData));
    images.forEach((image) => formData.append("files", image as File));

    try {
      // MOCK API Success
      // await new Promise(resolve => setTimeout(resolve, 1500));
      const res = await addProduct(formData).unwrap()
      if (res.success) {
        toast.success("Tour created", { id: toastId });
        form.reset();
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
      // console.log("Product Data Sent to API:", productData);

      toast.success(`Product "${data.title}" created successfully!`, { id: toastId });
      form.reset();
      setImages([]);
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as any)?.message || "Something went wrong during product creation", {
        id: toastId,
      });
    }
  };

  // Group options by parent name for better UX
  const groupedCategoryOptions = categoryOptions.reduce((acc, option) => {
    // Check if the value is an ID (which means it's a child category)
    const groupName = option.label.includes('/')
      ? option.label.split(' / ')[0]
      : 'Root Categories';

    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(option);
    return acc;
  }, {} as Record<string, CategoryOption[]>);


  return (
    <div className="w-full max-w-4xl mx-auto px-5 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Enter the details for a new product to be listed in the store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="add-product-form"
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {/* ... (Basic Information - Title, SKU) ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Casual Cotton T-Shirt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., TSH-001-BLUE-M" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- Pricing & Categories --- */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        {/* Use {...field} directly as it handles the value string */}
                        <Input type="number" step="0.01" placeholder="99.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- CATEGORY SELECT FIELD --- */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(groupedCategoryOptions).map((groupName) => (
                            <div key={groupName}>
                              {groupName !== 'Root Categories' && (
                                <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">{groupName}</p>
                              )}
                              {groupedCategoryOptions[groupName].map((item) => (
                                // item.value is the unique path (e.g., "MEN/SHIRT")
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Adidas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- Product Description & Image Uploader --- */}
              <div className="flex flex-col md:flex-row gap-5 items-stretch ">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A detailed description of the product, its features, and benefits."
                          {...field}
                          className="min-h-[150px] md:min-h-52"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1 mt-0 md:mt-7">
                  <FormLabel>Product Images</FormLabel>
                  <MultipleImageUploader onChange={setImages} />
                </div>
              </div>

              {/* --- Attributes: Color, Material, Gender --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Red, Navy Blue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Polyester, Silk" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Target Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENDER.map((g) => (
                            <SelectItem key={g} value={g}>
                              {g.charAt(0) + g.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- Size and Quantity Variants --- */}
              <div className="border border-dashed border-gray-300 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg text-gray-700">Size & Inventory Variants</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => appendSize({ size: "", quantity: "" })} // Use string default
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Size
                  </Button>
                </div>

                <div className="space-y-3">
                  {sizeFields.map((item, index) => (
                    <div className="flex gap-4 items-end" key={item.id}>
                      {/* Size Input */}
                      <FormField
                        control={form.control}
                        name={`sizes.${index}.size` as const}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            {index === 0 && <FormLabel>Size (e.g., S, M, XL, 32)</FormLabel>}
                            <FormControl>
                              <Input placeholder="Size" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Quantity Input */}
                      <FormField
                        control={form.control}
                        name={`sizes.${index}.quantity` as const}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            {index === 0 && <FormLabel>Quantity</FormLabel>}
                            <FormControl>
                              <Input type="number" placeholder="Quantity" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Remove Button */}
                      <Button
                        onClick={() => removeSize(index)}
                        variant="destructive"
                        className="!bg-red-700 mt-0 h-10 w-10"
                        size="icon"
                        type="button"
                        disabled={sizeFields.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {sizeFields.length === 0 && (
                  <p className="text-sm text-red-500">Please add at least one size variant.</p>
                )}
              </div>

            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" form="add-product-form" disabled={form.formState.isSubmitting || isAddingProduct}>
            {form.formState.isSubmitting || isAddingProduct ? "Adding Product..." : "Create Product"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}