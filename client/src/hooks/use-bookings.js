import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
function useBookings() {
  return useQuery({
    queryKey: [api.bookings.list.path],
    queryFn: async () => {
      const res = await fetch(api.bookings.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return api.bookings.list.responses[200].parse(await res.json());
    }
  });
}
function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.bookings.create.path, {
        method: api.bookings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
      if (!res.ok) {
        if (res.status === 400) throw new Error("Slot already booked or invalid");
        throw new Error("Failed to create booking");
      }
      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.slots.list.path] });
    }
  });
}
function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const url = buildUrl(api.bookings.cancel.path, { id });
      const res = await fetch(url, {
        method: api.bookings.cancel.method,
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      return api.bookings.cancel.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.slots.list.path] });
    }
  });
}
export {
  useBookings,
  useCancelBooking,
  useCreateBooking
};
