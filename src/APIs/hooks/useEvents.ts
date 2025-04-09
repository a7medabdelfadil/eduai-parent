import { useMutation, type UseMutationOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { addAttendance, fetchStudentUpcomingEvents, fetchUpcomingEvents, removeAttendance } from "../features/events";
import { type EventsResponse } from "../../types";
import { type AxiosError } from "axios";

export const useUpcomingEvents = (options?: UseQueryOptions<EventsResponse, Error>) => {
  return useQuery<EventsResponse, Error>({
    queryKey: ["upcoming-events"],
    queryFn: fetchUpcomingEvents,
    ...options,
  });
};

export const useStudentUpcomingEvents = (studentId?: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery<any, Error>({
    queryKey: ["studentUpcoming-events", studentId],
    queryFn: () => {
      if (!studentId) {
        return Promise.resolve(null);
      }
      return fetchStudentUpcomingEvents(studentId);
    },
    enabled: !!studentId,
    ...options,
  });
};

export const useAddAttendance = (
  options?: UseMutationOptions<void, AxiosError, string>
) => {
  return useMutation<void, AxiosError, string>({
    mutationFn: addAttendance,
    ...options,
  });
};

export const useRemoveAttendance = (
  options?: UseMutationOptions<void, AxiosError, string>
) => {
  return useMutation<void, AxiosError, string>({
    mutationFn: removeAttendance,
    ...options,
  });
};