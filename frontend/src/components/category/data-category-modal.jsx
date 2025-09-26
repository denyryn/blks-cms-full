import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createCategory,
  updateCategory,
} from "@/api-services/category.service";
import { toast } from "sonner";

export function CategoryModal({ initial, trigger, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    mode: initial ? "edit" : "add",
    data: initial || { name: "" },
  });

  async function handleSubmit(e) {
    e.preventDefault();

    let response, data;

    switch (form.mode) {
      case "add":
        ({ response, data } = await createCategory(form.data));
        break;
      case "edit":
        ({ response, data } = await updateCategory(form.data));
        break;
      default:
        return;
    }

    if (!response.ok) {
      toast.error(data?.message || "Operation failed. Please try again.");
      return;
    }

    onSuccess?.();
    setOpen(false);
    toast.success(data?.message || "Operation successful!");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
    }));
  }

  const title = form.mode === "edit" ? "Edit Data" : "Add Data";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                Make changes to your data here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.data.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
