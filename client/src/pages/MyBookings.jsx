import React from "react";
import { useBookings, useCancelBooking } from "@/hooks/use-bookings";
import { Navigation } from "@/components/Navigation";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CalendarX, CalendarCheck, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
function MyBookings() {
  const { data: bookings, isLoading } = useBookings();
  const cancelBooking = useCancelBooking();
  const { toast } = useToast();
  const handleCancel = async (id) => {
    try {
      await cancelBooking.mutateAsync(id);
      toast({
        title: "Booking Cancelled",
        description: "Your appointment has been successfully cancelled."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.message
      });
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-muted/30" }, /* @__PURE__ */ React.createElement(Navigation, null), /* @__PURE__ */ React.createElement("main", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter" }, /* @__PURE__ */ React.createElement("div", { className: "mb-8" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-display font-bold text-foreground" }, "My Bookings"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mt-2" }, "Manage your upcoming and past appointments.")), isLoading ? /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center h-64" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-primary" })) : !bookings || bookings.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-96 border-2 border-dashed border-border rounded-3xl bg-white/50" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ React.createElement(CalendarX, { className: "w-8 h-8 text-muted-foreground" })), /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-lg text-foreground" }, "No Bookings Yet"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mt-2 mb-6" }, "You haven't made any appointments yet."), /* @__PURE__ */ React.createElement(Button, { asChild: true }, /* @__PURE__ */ React.createElement("a", { href: "/dashboard" }, "Book Appointment"))) : /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, bookings.map((booking) => {
    const isUpcoming = new Date(booking.slot.date) >= new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0));
    const isCancelled = booking.status === "cancelled";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: booking.id,
        className: `bg-white rounded-xl p-6 border shadow-sm transition-all hover:shadow-md ${isCancelled ? "opacity-70 bg-muted/30 border-dashed" : "border-border"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-4" }, /* @__PURE__ */ React.createElement("div", { className: `w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isCancelled ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}` }, isCancelled ? /* @__PURE__ */ React.createElement(XCircle, { className: "w-6 h-6" }) : /* @__PURE__ */ React.createElement(CalendarCheck, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-1" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-lg" }, format(new Date(booking.slot.date), "EEEE, MMMM do, yyyy")), /* @__PURE__ */ React.createElement(Badge, { variant: isCancelled ? "destructive" : isUpcoming ? "default" : "secondary" }, isCancelled ? "Cancelled" : isUpcoming ? "Upcoming" : "Completed")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-muted-foreground" }, /* @__PURE__ */ React.createElement(Clock, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, booking.slot.startTime, " - ", booking.slot.endTime)))), !isCancelled && isUpcoming && /* @__PURE__ */ React.createElement(AlertDialog, null, /* @__PURE__ */ React.createElement(AlertDialogTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { variant: "outline", className: "text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" }, "Cancel")), /* @__PURE__ */ React.createElement(AlertDialogContent, null, /* @__PURE__ */ React.createElement(AlertDialogHeader, null, /* @__PURE__ */ React.createElement(AlertDialogTitle, null, "Cancel Appointment?"), /* @__PURE__ */ React.createElement(AlertDialogDescription, null, "This action cannot be undone. This will permanently cancel your booking for ", format(new Date(booking.slot.date), "MMMM do"), ".")), /* @__PURE__ */ React.createElement(AlertDialogFooter, null, /* @__PURE__ */ React.createElement(AlertDialogCancel, null, "Keep it"), /* @__PURE__ */ React.createElement(
        AlertDialogAction,
        {
          onClick: () => handleCancel(booking.id),
          className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        },
        "Yes, Cancel"
      )))))
    );
  }))));
}
export {
  MyBookings as default
};
