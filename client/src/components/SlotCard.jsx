import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import { format } from "date-fns";
function SlotCard({ slot, onBook, onDelete, isAdmin, isBooking }) {
  const startTime = slot.startTime;
  const endTime = slot.endTime;
  const isFull = slot.bookedCount >= slot.capacity;
  return /* @__PURE__ */ React.createElement(Card, { className: `group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/60 ${isFull && !isAdmin ? "opacity-60 grayscale" : "hover:-translate-y-1 bg-white"}` }, /* @__PURE__ */ React.createElement(CardContent, { className: "p-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-semibold" }, format(new Date(slot.date), "EEE, MMM d")), isAdmin && /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "destructive",
      size: "icon",
      className: "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
      onClick: () => onDelete?.(slot.id)
    },
    /* @__PURE__ */ React.createElement("span", { className: "sr-only" }, "Delete"),
    /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "w-3 h-3" }, /* @__PURE__ */ React.createElement("path", { d: "M3 6h18" }), /* @__PURE__ */ React.createElement("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }), /* @__PURE__ */ React.createElement("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }))
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-foreground font-display font-semibold text-lg" }, /* @__PURE__ */ React.createElement(Clock, { className: "w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ React.createElement("span", null, startTime, " - ", endTime)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm text-muted-foreground" }, /* @__PURE__ */ React.createElement(Users, { className: "w-4 h-4" }), /* @__PURE__ */ React.createElement("span", null, slot.bookedCount, " / ", slot.capacity, " booked")), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-secondary h-1.5 rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "bg-primary h-full rounded-full transition-all duration-500",
      style: { width: `${slot.bookedCount / slot.capacity * 100}%` }
    }
  ))), !isAdmin && /* @__PURE__ */ React.createElement(
    Button,
    {
      className: "w-full mt-4 font-medium shadow-lg shadow-primary/20",
      disabled: isFull || isBooking,
      onClick: () => onBook?.(slot)
    },
    isBooking ? "Booking..." : isFull ? "Full" : "Book Slot"
  )));
}
export {
  SlotCard
};
