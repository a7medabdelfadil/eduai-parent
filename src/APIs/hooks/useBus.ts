import { BusInfo, fetchBusInfo, fetchBusSubscriptionInfo, fetchMyRegion, fetchStudentBusId, fetchSubscribeStudentToBus, MyRegion, Region, SubscriptionInfo } from './../features/bus';
import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchAllRegions } from "../features/bus";

export const useGetRegions = (
  options?: UseQueryOptions<Region[], Error>
) => {
  return useQuery<Region[], Error>({
    queryKey: ["regions"],
    queryFn: fetchAllRegions,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
};

export const useGetMyRegion = () => {
  return useQuery<MyRegion, Error>({
    queryKey: ["my-region"],
    queryFn: fetchMyRegion,
    staleTime: Infinity,
  });
};

export const useBusSubscriptionInfo = (regionId?: number) => {
  return useQuery<SubscriptionInfo, Error>({
    queryKey: ["bus-subscription", regionId],
    queryFn: () => fetchBusSubscriptionInfo(regionId!),
    enabled: !!regionId, // prevent running before regionId is ready
    staleTime: 5 * 60 * 1000,
  });
};

export const useStudentBusId = (studentId?: string) => {
  return useQuery<string, Error>({
    queryKey: ["student-bus-id", studentId],
    queryFn: async () => (await fetchStudentBusId(studentId!)).toString(),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // data remains fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
export const useSubscribeStudentToBus = () => {
  return useMutation({
    mutationFn: fetchSubscribeStudentToBus,
  });
};

export const useBusInfo = (busId?: number) => {
  return useQuery<BusInfo, Error>({
    queryKey: ["bus-info", busId],
    queryFn: () => fetchBusInfo(busId!),
    enabled: !!busId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};