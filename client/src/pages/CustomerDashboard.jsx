import React from "react";
import { useState } from "react";
import { useSlots } from "@/hooks/use-slots";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Navigation } from "@/components/Navigation";
import { SlotCard } from "@/components/SlotCard";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar as CalendarIcon, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
function CustomerDashboard() {
  const [date, setDate] = useState(/* @__PURE__ */ new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const formattedDate = date ? format(date, "yyyy-MM-dd") : void 0;
  const { data: slots, isLoading } = useSlots({ date: formattedDate });
  const createBooking = useCreateBooking();
  const { toast } = useToast();
  const handleBooking = async () => {
    if (!selectedSlot) return;
    try {
      await createBooking.mutateAsync({ slotId: selectedSlot.id });
      toast({
        title: "Booking Requested",
        description: `Your appointment request for ${selectedSlot.date} at ${selectedSlot.startTime} is pending approval.`
      });
      setSelectedSlot(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message
      });
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-muted/30" }, /* @__PURE__ */ React.createElement(Navigation, null), /* @__PURE__ */ React.createElement("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter" }, /* @__PURE__ */ React.createElement("div", { className: "mb-8" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-display font-bold text-foreground" }, "Book an Appointment"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mt-2" }, "Select a date and time slot that works for you.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-4 xl:col-span-3 space-y-6" }, /* @__PURE__ */ React.createElement(Card, { className: "border-border/60 shadow-sm" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-0" }, /* @__PURE__ */ React.createElement(
    Calendar,
    {
      mode: "single",
      selected: date,
      onSelect: setDate,
      disabled: (date2) => date2 < new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)),
      initialFocus: true,
      className: "p-3 w-full flex justify-center"
    }
  ))), /* @__PURE__ */ React.createElement(Card, { className: "bg-primary/5 border-primary/10 shadow-none" }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-4 flex gap-3" }, /* @__PURE__ */ React.createElement(Info, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-primary/80" }, "Select a date to view available time slots. Green slots are available for booking.")))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-8 xl:col-span-9" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl border border-border/60 shadow-sm min-h-[500px] p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-6 border-b border-border pb-4" }, /* @__PURE__ */ React.createElement(CalendarIcon, { className: "w-5 h-5 text-muted-foreground" }), /* @__PURE__ */ React.createElement("h2", { className: "font-semibold text-lg" }, "Available Slots for ", date ? format(date, "EEEE, MMMM do") : "Selected Date")), isLoading ? /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center h-64" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-primary" })) : !slots || slots.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-64 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ React.createElement(CalendarIcon, { className: "w-8 h-8 text-muted-foreground" })), /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-lg text-foreground" }, "No Slots Available"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground max-w-xs mt-2" }, "There are no time slots available for this date. Please try selecting another day.")) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" }, slots.map((slot) => /* @__PURE__ */ React.createElement(
    SlotCard,
    {
      key: slot.id,
      slot,
      onBook: (s) => setSelectedSlot(s),
      isBooking: createBooking.isPending && selectedSlot?.id === slot.id
    }
  ))))))), /* @__PURE__ */ React.createElement(AlertDialog, { open: !!selectedSlot, onOpenChange: (open) => !open && setSelectedSlot(null) }, /* @__PURE__ */ React.createElement(AlertDialogContent, null, /* @__PURE__ */ React.createElement(AlertDialogHeader, null, /* @__PURE__ */ React.createElement(AlertDialogTitle, null, "Confirm Booking"), /* @__PURE__ */ React.createElement(AlertDialogDescription, null, "Are you sure you want to book an appointment for", " ", /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-foreground" }, selectedSlot ? format(new Date(selectedSlot.date), "MMMM do") : ""), " ", "at", " ", /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-foreground" }, selectedSlot?.startTime), "?")), /* @__PURE__ */ React.createElement(AlertDialogFooter, null, /* @__PURE__ */ React.createElement(AlertDialogCancel, null, "Cancel"), /* @__PURE__ */ React.createElement(AlertDialogAction, { onClick: handleBooking, disabled: createBooking.isPending }, createBooking.isPending ? "Confirming..." : "Confirm Booking")))));
}
export {
  CustomerDashboard as default
};
