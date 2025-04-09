import axiosInstance from "../axios";
import type { ParentStudentsResponse, StudentsResponse, StudentsWithGradesResponse } from "../../types";

export const getStudents = async (): Promise<StudentsResponse> => {
  const response = await axiosInstance.get<StudentsResponse>("/api/v1/shared/user/students");
  return response.data;
};

export const fetchStudentTeachers = async (studentId: string) => {
  const response = await axiosInstance.get(`/api/v1/complain/student-teachers?student-id=${studentId}`);
  return response.data; 
};

export const getStudentsSimpleData = async (): Promise<ParentStudentsResponse> => {
  const response = await axiosInstance.get<ParentStudentsResponse>("/api/v1/parent/students");
  return response.data;
};

export const getStudentsWithGrades = async (examId: string): Promise<StudentsWithGradesResponse> => {
  const response = await axiosInstance.get<StudentsWithGradesResponse>(
    `/api/v1/academic/educationalAffairs/exams/students-with-grade/${examId}`
  );
  return response.data;
};
