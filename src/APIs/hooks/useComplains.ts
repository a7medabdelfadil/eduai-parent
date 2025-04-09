import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  createComplaint,
  fetchAllComplains,
} from "../features/complains";
import type { ComplainsResponse, ComplaintResponse } from "../../types";

export const useGetAllComplains = (
    options?: UseQueryOptions<ComplainsResponse, Error>,
  ) => {
    return useQuery<ComplainsResponse, Error>({
      queryKey: ["complains"],
      queryFn: () => fetchAllComplains(),
      staleTime: 1000 * 60 * 5,
      ...options,
    });
  };

  export const useCreateComplaint = (
    options?: UseMutationOptions<any, Error, ComplaintResponse>
  ) => {
    const queryClient = useQueryClient();
  
    return useMutation<any, Error, ComplaintResponse>({
      mutationFn: createComplaint,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ["complaints"] });
      },
      ...options,
    });
  };