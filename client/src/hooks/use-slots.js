import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
function useSlots(filters) {
  return useQuery({
    queryKey: [api.slots.list.path, filters],
    queryFn: async () => {
      const url = new URL(api.slots.list.path, window.location.origin);
      if (filters?.date) url.searchParams.append("date", filters.date);
      if (filters?.startDate) url.searchParams.append("startDate", filters.startDate);
      if (filters?.endDate) url.searchParams.append("endDate", filters.endDate);
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch slots");
      return api.slots.list.responses[200].parse(await res.json());
    }
  });
}
function useCreateSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.slots.create.path, {
        method: api.slots.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to create slot");
      return api.slots.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.slots.list.path] });
    }
  });
}
function useDeleteSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const url = buildUrl(api.slots.delete.path, { id });
      const res = await fetch(url, {
        method: api.slots.delete.method,
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to delete slot");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.slots.list.path] });
    }
  });
}
export {
  useCreateSlot,
  useDeleteSlot,
  useSlots
};
