import React from "react";
import { useBookings, useCancelBooking } from "@/hooks/use-bookings";
import { Navigation } from "@/components/Navigation";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
function AdminDashboard() {
  const { data: bookings, isLoading } = useBookings();
  const cancelBooking = useCancelBooking();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const handleCancel = async (id) => {
    try {
      await cancelBooking.mutateAsync(id);
      toast({
        title: "Booking Cancelled",
        description: "The appointment has been successfully cancelled."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.message
      });
    }
  };
  const filteredBookings = bookings?.filter(
    (booking) => booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || booking.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    // Sort by Date Ascending
    const dateA = new Date(a.slot.date);
    const dateB = new Date(b.slot.date);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    // Sort by Time Ascending
    return a.slot.startTime.localeCompare(b.slot.startTime);
  });
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-muted/30" }, /* @__PURE__ */ React.createElement(Navigation, null), /* @__PURE__ */ React.createElement("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-display font-bold text-foreground" }, "Admin Dashboard"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mt-1" }, "Overview of all appointments and bookings.")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 w-full md:w-auto" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1 md:w-64" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement(
    Input,
    {
      placeholder: "Search by user...",
      className: "pl-9 bg-white",
      value: searchTerm,
      onChange: (e) => setSearchTerm(e.target.value)
    }
  )), /* @__PURE__ */ React.createElement(Button, { variant: "outline", size: "icon", className: "bg-white" }, /* @__PURE__ */ React.createElement(Filter, { className: "h-4 w-4" })))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-xl border border-border/60 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-medium text-muted-foreground" }, "Total Bookings"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-3xl font-bold" }, bookings?.length || 0)), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-xl border border-border/60 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-medium text-muted-foreground" }, "Upcoming"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-3xl font-bold text-primary" }, bookings?.filter((b) => b.status === "confirmed" && new Date(b.slot.date) >= /* @__PURE__ */ new Date()).length || 0)), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-xl border border-border/60 shadow-sm" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-medium text-muted-foreground" }, "Cancelled"), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-3xl font-bold text-destructive" }, bookings?.filter((b) => b.status === "cancelled").length || 0))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "p-6 border-b border-border/60" }, /* @__PURE__ */ React.createElement("h2", { className: "font-semibold text-lg" }, "Recent Bookings")), isLoading ? /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center h-64" }, /* @__PURE__ */ React.createElement(Loader2, { className: "h-8 w-8 animate-spin text-primary" })) : /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableHeader, null, /* @__PURE__ */ React.createElement(TableRow, { className: "bg-muted/30" }, /* @__PURE__ */ React.createElement(TableHead, null, "User"), /* @__PURE__ */ React.createElement(TableHead, null, "Phone"), /* @__PURE__ */ React.createElement(TableHead, null, "Date"), /* @__PURE__ */ React.createElement(TableHead, null, "Time"), /* @__PURE__ */ React.createElement(TableHead, null, "Status"), /* @__PURE__ */ React.createElement(TableHead, { className: "text-right" }, "Actions"))), /* @__PURE__ */ React.createElement(TableBody, null, filteredBookings?.length === 0 ? /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, { colSpan: 5, className: "h-24 text-center text-muted-foreground" }, "No bookings found.")) : filteredBookings?.map((booking) => /* @__PURE__ */ React.createElement(TableRow, { key: booking.id }, /* @__PURE__ */ React.createElement(TableCell, { className: "font-medium" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement("span", null, booking.user.name), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-muted-foreground" }, booking.user.username))), /* @__PURE__ */ React.createElement(TableCell, null, booking.user.phone || "N/A"), /* @__PURE__ */ React.createElement(TableCell, null, format(new Date(booking.slot.date), "MMM d, yyyy")), /* @__PURE__ */ React.createElement(TableCell, null, booking.slot.startTime, " - ", booking.slot.endTime), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Badge, { variant: booking.status === "confirmed" ? "default" : "destructive" }, booking.status)), /* @__PURE__ */ React.createElement(TableCell, { className: "text-right" }, /* @__PURE__ */ React.createElement(DropdownMenu, null, /* @__PURE__ */ React.createElement(DropdownMenuTrigger, { asChild: true }, /* @__PURE__ */ React.createElement(Button, { variant: "ghost", className: "h-8 w-8 p-0" }, /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, "Open menu"), /* @__PURE__ */ React.createElement(MoreHorizontal, { className: "h-4 w-4" }))), /* @__PURE__ */ React.createElement(DropdownMenuContent, { align: "end" }, /* @__PURE__ */ React.createElement(DropdownMenuLabel, null, "Actions"), /* @__PURE__ */ React.createElement(DropdownMenuItem, { onClick: () => navigator.clipboard.writeText(booking.user.username) }, "Copy user email"), /* @__PURE__ */ React.createElement(DropdownMenuSeparator, null), booking.status === "confirmed" && /* @__PURE__ */ React.createElement(
    DropdownMenuItem,
    {
      className: "text-destructive focus:text-destructive",
      onClick: () => handleCancel(booking.id)
    },
    "Cancel booking"
  )))))))))));
}
export {
  AdminDashboard as default
};
