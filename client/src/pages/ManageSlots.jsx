import React from "react";
import { useState } from "react";
import { useSlots, useCreateSlot, useDeleteSlot } from "@/hooks/use-slots";
import { Navigation } from "@/components/Navigation";
import { SlotCard } from "@/components/SlotCard";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
const createSlotSchema = api.slots.create.input.extend({
  // Override date to be string for form input
  capacity: z.coerce.number().min(1)
});
function ManageSlots() {
  const [date, setDate] = useState(/* @__PURE__ */ new Date());
  const formattedDate = date ? format(date, "yyyy-MM-dd") : void 0;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: slots, isLoading } = useSlots({ date: formattedDate });
  const createSlot = useCreateSlot();
  const deleteSlot = useDeleteSlot();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(createSlotSchema),
    defaultValues: {
      date: formattedDate || "",
      startTime: "09:00",
      endTime: "10:00",
      capacity: 1
    }
  });
  if (date && formattedDate && form.getValues("date") !== formattedDate) {
    form.setValue("date", formattedDate);
  }
  const onSubmit = async (data) => {
    try {
      await createSlot.mutateAsync(data);
      toast({
        title: "Slot Created",
        description: "The time slot has been successfully created."
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create slot",
        description: error.message
      });
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;
    try {
      await deleteSlot.mutateAsync(id);
      toast({
        title: "Slot Deleted",
        description: "The time slot has been removed."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete slot",
        description: error.message
      });
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-muted/30" }, /* @__PURE__ */ React.createElement(Navigation, null), /* @__PURE__ */ React.createElement("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-display font-bold text-foreground" }, "Manage Slots"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mt-1" }, "Create and manage availability for appointments.")), /* @__PURE__ */ React.createElement(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen }, /* @__PURE__ */ React.createElement(DialogTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { className: "shadow-lg shadow-primary/20" }, /* @__PURE__ */ React.createElement(Plus, { className: "mr-2 h-4 w-4" }), " Create Slot")), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(DialogHeader, null, /* @__PURE__ */ React.createElement(DialogTitle, null, "Create New Slot"), /* @__PURE__ */ React.createElement(DialogDescription, null, "Add a new time slot for ", date ? format(date, "MMMM do, yyyy") : "selected date", ".")), /* @__PURE__ */ React.createElement(Form, { ...form }, /* @__PURE__ */ React.createElement("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4 pt-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "date",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Date"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "date", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "capacity",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Capacity"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "number", min: 1, ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "startTime",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "Start Time"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "time", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  ), /* @__PURE__ */ React.createElement(
    FormField,
    {
      control: form.control,
      name: "endTime",
      render: ({ field }) => /* @__PURE__ */ React.createElement(FormItem, null, /* @__PURE__ */ React.createElement(FormLabel, null, "End Time"), /* @__PURE__ */ React.createElement(FormControl, null, /* @__PURE__ */ React.createElement(Input, { type: "time", ...field })), /* @__PURE__ */ React.createElement(FormMessage, null))
    }
  )), /* @__PURE__ */ React.createElement(Button, { type: "submit", className: "w-full", disabled: createSlot.isPending }, createSlot.isPending ? /* @__PURE__ */ React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Create Slot")))))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-4 xl:col-span-3" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl border border-border/60 shadow-sm p-4 sticky top-24" }, /* @__PURE__ */ React.createElement(
    Calendar,
    {
      mode: "single",
      selected: date,
      onSelect: setDate,
      className: "w-full flex justify-center"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-8 xl:col-span-9" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl border border-border/60 shadow-sm p-6 min-h-[500px]" }, /* @__PURE__ */ React.createElement("h2", { className: "font-semibold text-lg mb-6 pb-4 border-b" }, "Slots for ", date ? format(date, "EEEE, MMMM do") : "Selected Date"), isLoading ? /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center h-64" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-primary" })) : !slots || slots.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-64 text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "No slots created for this date."), /* @__PURE__ */ React.createElement(Button, { variant: "link", onClick: () => setIsDialogOpen(true) }, "Create one now")) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, slots.map((slot) => /* @__PURE__ */ React.createElement(
    SlotCard,
    {
      key: slot.id,
      slot,
      isAdmin: true,
      onDelete: handleDelete
    }
  ))))))));
}
export {
  ManageSlots as default
};
