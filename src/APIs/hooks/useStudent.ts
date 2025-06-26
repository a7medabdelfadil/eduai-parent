import { useMutation, UseMutationOptions, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { CreateParentStudentRequest, ParentStudentResponse, type ParentStudentsResponse, type StudentsResponse, type StudentsWithGradesResponse } from "~/types";
import { createParentStudent, fetchStudentTeachers, getAssociationTypes, getStudents, getStudentsSimpleData, getStudentsWithGrades, getStudyLevels } from "../features/student";

export const useGetStudents = (
  options?: UseQueryOptions<StudentsResponse, Error>
) => {
  return useQuery<StudentsResponse, Error>({
    queryKey: ["students"], 
    queryFn: getStudents,
    ...options,
  });
};

export const useGetStudentTeachers = (
  studentId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery<any, Error>({
    queryKey: ['student-teachers', studentId], // queryKey
    queryFn: () => fetchStudentTeachers(studentId), // query function
    enabled: !!studentId, // Prevent query from running if studentId is not provided
    ...options, // Additional options
  });
};

// Hook to fetch students with grades by exam ID
export const useGetStudentsWithGrades = (
  examId: string,
  options?: UseQueryOptions<StudentsWithGradesResponse, Error>
) => {
  return useQuery<StudentsWithGradesResponse, Error>({
    queryKey: ["students-with-grades", examId],
    queryFn: () => getStudentsWithGrades(examId),
    enabled: !!examId, // Prevent query from running if examId is not provided
    ...options,
  });
};


export const useGetStudentsSimpleData = (
  options?: UseQueryOptions<ParentStudentsResponse, Error>
) => {
  return useQuery<ParentStudentsResponse, Error>({
    queryKey: ["parent-students"], // Unique key for this query
    queryFn: getStudentsSimpleData, // Function to fetch the data
    ...options,
  });
};

export const useCreateParentStudent = (
  options?: UseMutationOptions<
    ParentStudentResponse,
    Error,
    CreateParentStudentRequest
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<ParentStudentResponse, Error, CreateParentStudentRequest>({
    mutationFn: createParentStudent,

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["parent-students"] });
      options?.onSuccess?.(data, variables, context);
    },

    ...options,
  });
};

export const useGetAssociationTypes = (
  options?: UseQueryOptions<Record<string, string>, Error>
) => {
  return useQuery<Record<string, string>, Error>({
    queryKey: ["association-types"],
    queryFn: getAssociationTypes,
    ...options,
  });
};

export const useGetStudyLevels = (
  options?: UseQueryOptions<Record<string, string>, Error>
) => {
  return useQuery<Record<string, string>, Error>({
    queryKey: ["study-levels"],
    queryFn: getStudyLevels,
    ...options,
  });
};
