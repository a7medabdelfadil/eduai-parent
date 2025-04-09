import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { AttemptAnswersResponse, DailyExamAttemptsResponse, DailyExamResponse, ExamFormData, ExamListResponse, ExamResultsResponse, Upcoming_Previous_Exams, UpcomingExamByIdResponse } from "../../types";
import { createExam, fetchAllExams, fetchAllPreviousExams, fetchAllUpcomingExams, fetchAttemptAnswers, fetchDailyExamAttempts, fetchDailyExamDataByStudentId, fetchExamResults, fetchPreviousExamsByStudentId, fetchUpcomingExamsByStudentId, putGrade } from "../features/exam";

export const useGetAllExams = (
  options?: UseQueryOptions<ExamListResponse, Error>,
) => {
  return useQuery<ExamListResponse, Error>({
    queryKey: ["exams"],
    queryFn: () => fetchAllExams(),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useGetAllUpcomingExams = (
  options?: UseQueryOptions<Upcoming_Previous_Exams, Error>,
) => {
  return useQuery<Upcoming_Previous_Exams, Error>({
    queryKey: ["upcoming"],
    queryFn: () => fetchAllUpcomingExams(),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
export const useGetAllPreviousExams = (
  options?: UseQueryOptions<Upcoming_Previous_Exams, Error>,
) => {
  return useQuery<Upcoming_Previous_Exams, Error>({
    queryKey: ["previous"],
    queryFn: () => fetchAllPreviousExams(),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useGetPreviousExamsByStudentId = (
  studentId: string,
  options?: UseQueryOptions<UpcomingExamByIdResponse, Error>
) => {
  return useQuery<UpcomingExamByIdResponse, Error>({
    queryKey: ["previousExamsById", studentId], // Key includes studentId for specificity
    queryFn: () => fetchPreviousExamsByStudentId(studentId), // Fetch function
    enabled: !!studentId, // Ensure query only runs when studentId is provided
    ...options,
  });
};

export const useGetUpcomingExamsByStudentId = (
  studentId: string,
  options?: UseQueryOptions<UpcomingExamByIdResponse, Error>
) => {
  return useQuery<UpcomingExamByIdResponse, Error>({
    queryKey: ["upcomingExamsById", studentId], // Key includes studentId for specificity
    queryFn: () => fetchUpcomingExamsByStudentId(studentId), // Fetch function
    enabled: !!studentId, // Ensure query only runs when studentId is provided
    ...options,
  });
};

export const useCreateExam = (
  options?: UseMutationOptions<ExamFormData, Error, Partial<ExamFormData>>,
) => {
  const queryClient = useQueryClient();
  return useMutation<ExamFormData, Error, Partial<ExamFormData>>({
    mutationFn: createExam,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["createExam"] });
    },
    ...options,
  });
};

export const useGetExamResults = (
  examId: string,
  options?: UseQueryOptions<ExamResultsResponse, Error>
) => {
  return useQuery<ExamResultsResponse, Error>({
    queryKey: ["examResults", examId],
    queryFn: () => fetchExamResults(examId),
    ...options,
  });
};

export const usePutGrade = (
  options?: UseMutationOptions<any, Error, { examResultId: string; scoreData: { score: number; scoreDate: string } }>
) => {
  return useMutation({
    mutationFn: ({ examResultId, scoreData }) => putGrade(examResultId, scoreData),
    ...options,
  });
};

export const useGetDailyExamData = (
  id: string,
  options?: UseQueryOptions<DailyExamResponse, Error> 
) => {
  return useQuery<DailyExamResponse, Error>({
    queryKey: ["daily-exam-data", id], 
    queryFn: () => fetchDailyExamDataByStudentId(id),
    enabled: !!id, 
    ...options,
  });
};


export const useGetDailyExamAttempts = (
  studentId: string,
  examId: string,
  options?: UseQueryOptions<DailyExamAttemptsResponse, Error>
) => {
  return useQuery<DailyExamAttemptsResponse, Error>({
    queryKey: ["daily-exam-attempts", studentId, examId],
    queryFn: () => fetchDailyExamAttempts(studentId, examId),
    enabled: !!studentId && !!examId, 
    ...options,
  });
};

export const useGetAttemptAnswers = (
  studentId: string,
  attemptId: string,
  options?: UseQueryOptions<AttemptAnswersResponse, Error>
) => {
  return useQuery<AttemptAnswersResponse, Error>({
    queryKey: ["attempt-answers", studentId, attemptId],
    queryFn: () => fetchAttemptAnswers(studentId, attemptId),
    enabled: !!studentId && !!attemptId,
    ...options,
  });
};