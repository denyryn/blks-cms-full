import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FileDropzone from "@/components/file-dropzone";
import { Button } from "@/components/ui/button";
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
import { MinimalTiptap } from "@/components/ui/shadcn-io/minimal-tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createProduct,
  updateProduct,
  getProduct,
} from "@/api-services/products.service";
import { useCategories } from "@/hooks/use-categories";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

const formSchema = z.object({
  category_id: z.string().min(1, "Category is required"),
  name: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  image: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),
});

export default function ProductEditCreatePage() {
  // Take id from params if any
  const { id } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: categories, loading: categoriesLoading } = useCategories();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: "",
      name: "",
      description: "",
      image: null,
      price: "",
    },
  });

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      let response, data;
      if (!id) {
        ({ response, data } = await createProduct(values));
      } else {
        ({ response, data } = await updateProduct({
          id: parseInt(id),
          ...values,
        }));
      }

      if (!id) form.reset();

      if (!response.ok) {
        toast.error(data?.message || "Error submitting form");
        return;
      }

      toast.success(
        data?.message || `Product ${id ? "updated" : "created"} successfully`
      );
    } catch (error) {
      toast.error("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Fetch product data if editing (id exists)
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const { response, data } = await getProduct(id);
        if (!response.ok) {
          toast.error(data?.message || "Error fetching product data");
          return;
        }
        const product = data?.data;
        form.reset({
          category_id: product.category.id.toString(),
          name: product.name,
          description: product.description,
          image: product.image_url || null,
          price: product.price.toString(),
        });
      } catch (error) {
        toast.error("Error fetching product data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, form]);

  useEffect(() => {
    const file = form.getValues("image");
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [form.watch("image")]);

  const submitText = (() => {
    if (isSubmitting) return id ? "Updating..." : "Creating...";
    return id ? "Update Product" : "Create Product";
  })();

  return (
    <div className="container p-6">
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your inventory
        </p>
      </div> */}

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading product data...</p>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full"
          >
            {/* Left - Product Image (full height) */}
            <div className="space-y-4 h-full">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  const previewSrc = (() => {
                    if (field.value instanceof File) {
                      return URL.createObjectURL(field.value);
                    }
                    if (typeof field.value === "string" && field.value) {
                      return field.value;
                    }
                    return "https://ui.shadcn.com/placeholder.svg";
                  })();

                  return (
                    <FormItem className="h-full">
                      <FormControl>
                        <img
                          src={previewSrc}
                          alt="Product preview"
                          className="w-full h-full max-h-[600px] object-cover rounded-[var(--radius)]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* Right - Inputs */}
            <div className="flex flex-col gap-6">
              {/* Product Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <div></div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(() => {
                          switch (true) {
                            case categoriesLoading:
                              return (
                                <SelectItem value="loading" disabled>
                                  Loading categories...
                                </SelectItem>
                              );
                            case categories?.length > 0:
                              return categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ));
                            default:
                              return (
                                <SelectItem value="empty" disabled>
                                  No categories available
                                </SelectItem>
                              );
                          }
                        })()}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the product price in USD
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dropzone */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Files</FormLabel>
                    <FormControl>
                      <FileDropzone
                        accept="image/*"
                        onFileSelect={(file) => {
                          if (!file) return field.onChange(null);
                          field.onChange(file); // store the actual File object
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bottom - Description + Buttons */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <MinimalTiptap
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Enter product description..."
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of the product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {submitText}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
