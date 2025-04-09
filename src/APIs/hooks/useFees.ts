import { useQuery} from "@tanstack/react-query";
import type {
  UseQueryOptions,
} from "@tanstack/react-query";
import type { FeesResponse } from "../../types";
import { fetchAllFees } from "../features/fees";

export const useGetAllFees = (
  studentId: string | undefined,
  options?: UseQueryOptions<FeesResponse, Error>,
) => {
  return useQuery<FeesResponse, Error>({
    queryKey: ["fees", studentId],
    queryFn: () => fetchAllFees(studentId!),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};