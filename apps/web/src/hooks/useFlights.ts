import { useQuery } from "@tanstack/react-query";
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