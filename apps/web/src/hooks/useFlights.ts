import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useFlights() {
  return useQuery({
    queryKey: ["flights"],
    queryFn: async () => (await api.get("/flights")).data.data,
  });
}

export function useDestinations() {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => (await api.get("/destinations")).data.data,
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => (await api.get("/gallery")).data.data,
  });
}

export function useFlight(id: string) {
  return useQuery({
    queryKey: ["flights", id],
    queryFn: async () => (await api.get(`/flights/${id}`)).data.data,
    enabled: !!id,
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => (await api.get("/bookings")).data.data,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { flightId: string; cabinClass: "economy" | "business" | "orbital"; passengers: number }) => {
      const res = await api.post("/bookings", input);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["flights"] });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/bookings/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["flights"] });
    },
  });
}