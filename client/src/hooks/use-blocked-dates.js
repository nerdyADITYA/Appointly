import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
function useBlockedDates() {
  return useQuery({
    queryKey: [api.blockedDates.list.path],
    queryFn: async () => {
      const res = await fetch(api.blockedDates.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch blocked dates");
      return api.blockedDates.list.responses[200].parse(await res.json());
    }
  });
}
function useCreateBlockedDate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.blockedDates.create.path, {
        method: api.blockedDates.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to block date");
      return api.blockedDates.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.blockedDates.list.path] });
    }
  });
}
function useDeleteBlockedDate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const url = buildUrl(api.blockedDates.delete.path, { id });
      const res = await fetch(url, {
        method: api.blockedDates.delete.method,
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to unblock date");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.blockedDates.list.path] });
    }
  });
}
export {
  useBlockedDates,
  useCreateBlockedDate,
  useDeleteBlockedDate
};
