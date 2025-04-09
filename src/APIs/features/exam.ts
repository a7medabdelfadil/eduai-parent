import axiosInstance from "../axios";
import type { AttemptAnswersResponse, DailyExamAttemptsResponse, DailyExamResponse, ExamFormData, ExamListResponse, ExamResultsResponse, Upcoming_Previous_Exams, UpcomingExamByIdResponse } from "../../types";

export const fetchAllExams = async (): Promise<ExamListResponse> => {
    const response = await axiosInstance.get<ExamListResponse>(
        `/api/v1/academic/educationalAffairs/exams/teacher`
    );
    return response.data;
};
export const fetchAllUpcomingExams = async (): Promise<Upcoming_Previous_Exams> => {
    const response = await axiosInstance.get<Upcoming_Previous_Exams>(
        `/api/v1/academic/educationalAffairs/exams/upcoming`
    );
    return response.data;
};
export const getGPA = async (studentId: string): Promise<any> => {
    const response = await axiosInstance.get<any>(
        `/api/v1/student/progress/gpa-comparison-ForParent?studentId=${studentId}`
    );
    return response.data;
};
export const getAttendance = async (studentId: string): Promise<any> => {
    const response = await axiosInstance.get<any>(
        `/api/v1/student/progress/attendanceForParent?studentId=${studentId}`
    );
    return response.data;
};
export const getDailyPlan = async (studentId: string): Promise<any> => {
    const response = await axiosInstance.get<any>(
        `/api/v1/daily-exam/parent/daily-plan-percentage/${studentId}`
    );
    return response.data;
};
export const getStudentById = async (studentId: string): Promise<any> => {
    const response = await axiosInstance.get<any>(
        `/api/v1/management/student/${studentId}/update`
    );
    return response.data;
};
export const fetchAllPreviousExams = async (): Promise<Upcoming_Previous_Exams> => {
    const response = await axiosInstance.get<Upcoming_Previous_Exams>(
        `/api/v1/academic/educationalAffairs/exams/previous`
    );
    return response.data;
};

export const fetchPreviousExamsByStudentId = async (
  studentId: string
): Promise<UpcomingExamByIdResponse> => {
  const response = await axiosInstance.get<UpcomingExamByIdResponse>(
    `/api/v1/academic/educationalAffairs/exams/previousExamsForParent`,
    {
      params: { studentId },
    }
  );
  return response.data;
};

export const fetchUpcomingExamsByStudentId = async (
  studentId: string
): Promise<UpcomingExamByIdResponse> => {
  const response = await axiosInstance.get<UpcomingExamByIdResponse>(
    `api/v1/academic/educationalAffairs/exams/upcomingExamsForParent`,
    {
      params: { studentId },
    }
  );
  return response.data;
};

export const createExam = async (formData: Partial<ExamFormData>): Promise<ExamFormData> => {
    const response = await axiosInstance.post<ExamFormData>(
      "/api/v1/academic/educationalAffairs/exams",
      formData,
    );
    return response.data;
  };

  export const fetchExamResults = async (examId: string): Promise<ExamResultsResponse> => {
    const response = await axiosInstance.get<ExamResultsResponse>(`/api/v1/exam-results/exam/${examId}`);
    return response.data;
  };

  export const putGrade = async (examResultId: string, scoreData: { score: number; scoreDate: string }) => {
    const response = await axiosInstance.put(`/api/v1/exam-results/${examResultId}`, scoreData);
    return response.data;
  };

  export const fetchDailyExamDataByStudentId = async (id: string): Promise<DailyExamResponse> => {
    const response = await axiosInstance.get(`/api/v1/daily-exam/parent/${id}`);
    return response.data;
  };

  export const fetchDailyExamAttempts = async (
    studentId: string,
    examId: string
  ): Promise<DailyExamAttemptsResponse> => {
    const response = await axiosInstance.get(
      `/api/v1/daily-exam/parent/attempts-of-exam?student-id=${studentId}&exam-id=${examId}`
    );
    return response.data;
  };

  export const fetchAttemptAnswers = async (
    studentId: string,
    attemptId: string
  ): Promise<AttemptAnswersResponse> => {
    const response = await axiosInstance.get(
      `/api/v1/daily-exam/parent/answers-of-attempt?student-id=${studentId}&attempt-id=${attemptId}`
    );
    return response.data;
  };