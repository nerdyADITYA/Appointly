import React, { useState } from "react";
import { useBookings, useCancelBooking, useConfirmBooking } from "@/hooks/use-bookings";
import { Navigation } from "@/components/Navigation";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Filter, Check, X } from "lucide-react";
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

function AdminDashboard() {
  const { data: bookings, isLoading } = useBookings();
  const cancelBooking = useCancelBooking();
  const confirmBooking = useConfirmBooking();
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

  const handleConfirm = async (id) => {
    try {
      await confirmBooking.mutateAsync(id);
      toast({
        title: "Booking Confirmed",
        description: "The appointment has been successfully approved."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Confirmation Failed",
        description: error.message
      });
    }
  };

  const filteredBookings = bookings?.filter(
    (booking) => booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || booking.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || booking.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.slot.date);
    const dateB = new Date(b.slot.date);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return a.slot.startTime.localeCompare(b.slot.startTime);
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of all appointments and bookings.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user..."
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="bg-white">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-border/60 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
            <div className="mt-2 text-3xl font-bold">{bookings?.length || 0}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-border/60 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Upcoming</h3>
            <div className="mt-2 text-3xl font-bold text-primary">
              {bookings?.filter((b) => b.status === "confirmed" && new Date(b.slot.date) >= new Date()).length || 0}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-border/60 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">Cancelled</h3>
            <div className="mt-2 text-3xl font-bold text-destructive">
              {bookings?.filter((b) => b.status === "cancelled").length || 0}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/60">
            <h2 className="font-semibold text-lg">Recent Bookings</h2>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings?.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{booking.user.name}</span>
                          <span className="text-xs text-muted-foreground">{booking.user.email || booking.user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>{booking.user.phone || "N/A"}</TableCell>
                      <TableCell>{format(new Date(booking.slot.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {booking.slot.startTime} - {booking.slot.endTime}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={booking.status === "cancelled" ? "destructive" : "default"}
                          className={booking.status === "confirmed" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {booking.status !== "confirmed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                              onClick={() => handleConfirm(booking._id)}
                              title="Approve Booking"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          {booking.status !== "cancelled" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-red-100"
                              onClick={() => handleCancel(booking._id)}
                              title="Cancel Booking"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}

export { AdminDashboard as default };
