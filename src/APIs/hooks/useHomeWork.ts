import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchAllAttendances, fetchAllAttendancesSummary, fetchAllHomeWorks, fetchAllMaterials, fetchAllschedule, fetchSessionMaterials } from "../features/homework";

export const useGetAllHomeWorks = (
  date: string | undefined,
  studentId: string | undefined,
  options?: UseQueryOptions<any, Error>,
) => {
  return useQuery<any, Error>({
    queryKey: ["homeWorks", date, studentId],
    queryFn: () => fetchAllHomeWorks(date!, studentId!),
    enabled: !!date && !!studentId,
    ...options,
  });
};

export const useGetAllMaterials = (
  date: string | undefined,
  studentId: string | undefined,
  options?: UseQueryOptions<any, Error>,
) => {
  return useQuery<any, Error>({
    queryKey: ["materials", date, studentId],
    queryFn: () => fetchAllMaterials(date!, studentId!),
    enabled: !!date && !!studentId,
    ...options,
  });
};

export const useGetAllAttendances = (
  date: string | undefined,
  studentId: string | undefined,
  options?: UseQueryOptions<any, Error>,
) => {
  return useQuery<any, Error>({
    queryKey: ["attendey", date, studentId],
    queryFn: () => fetchAllAttendances(date!, studentId!),
    enabled: !!date && !!studentId,
    ...options,
  });
};
export const useGetAllAttendancesSumm = (
  studentId: string | undefined,
  options?: UseQueryOptions<any, Error>,
) => {
  return useQuery<any, Error>({
    queryKey: ["attendeySumm", studentId],
    queryFn: () => fetchAllAttendancesSummary(studentId!),
    enabled: !!studentId,
    ...options,
  });
};
export const useGetAllSchedule = (
  date: string | undefined,
  studentId: string | undefined,
  options?: UseQueryOptions<any, Error>,
) => {
  return useQuery<any, Error>({
    queryKey: ["schedule", date, studentId],
    queryFn: () => fetchAllschedule(date!, studentId!),
    enabled: !!date && !!studentId,
    ...options,
  });
};

export const useGetSessionMaterials = (
  sessionId: string | undefined,
  studentId: string | undefined,
  options?: UseQueryOptions<any, Error>,
) => {
  return useQuery<any, Error>({
    queryKey: ["sessionMaterials", sessionId, studentId],
    queryFn: () => fetchSessionMaterials(sessionId!, studentId!),
    enabled: !!sessionId && !!studentId,
    ...options,
  });
};
