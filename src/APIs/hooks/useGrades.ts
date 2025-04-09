import {useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type AcademicYearResponse } from "../../types";
import { fetchAcademicYears, fetchAllGrades, fetchSemesterByYear, fetchStudents } from "../features/grades";

export const useGetAllAcademicYear = (options?: UseQueryOptions<AcademicYearResponse, Error>) => {
  return useQuery<AcademicYearResponse, Error>({
    queryKey: ["academicYear"],
    queryFn: fetchAcademicYears,
    ...options,
  });
};
export const useGetAllStudents = (options?: UseQueryOptions<any, Error>) => {
  return useQuery<any, Error>({
    queryKey: ["students"],
    queryFn: fetchStudents,
    ...options,
  });
};

export const useGetSemesterByYear = (
    academicYearId: string | undefined,
    options?: UseQueryOptions<any, Error>,
  ) => {
    return useQuery<any, Error>({
      queryKey: ["SemesterByYear", academicYearId],
      queryFn: () => fetchSemesterByYear(academicYearId!),
      enabled: !!academicYearId,
      ...options,
    });
  };

export const useGetAllGrades = (
    semesterId: string | undefined,
    studentId: string | undefined,
    options?: UseQueryOptions<any, Error>,
  ) => {
    return useQuery<any, Error>({
      queryKey: ["Grades", semesterId, studentId],
      queryFn: () => fetchAllGrades(semesterId!, studentId!),
      enabled: !!semesterId && !!studentId,
      ...options,
    });
  };