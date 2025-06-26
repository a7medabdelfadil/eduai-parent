import axiosInstance from "../axios";
import type { CreateParentStudentRequest, ParentStudentResponse, ParentStudentsResponse, StudentsResponse, StudentsWithGradesResponse } from "../../types";

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
export const createParentStudent = async (
  payload: CreateParentStudentRequest
): Promise<ParentStudentResponse> => {
  const formData = new FormData();
  formData.append("studentIdPhoto", payload.studentIdPhoto);
  formData.append("studentProfilePhoto", payload.studentProfilePhoto);

  const certificates =
    payload.studentCertificatesOfAchievement ?? ([] as File[] | FileList);

  Array.from(certificates).forEach((file) =>
    formData.append("studentCertificatesOfAchievement", file)
  );

  formData.append("request", JSON.stringify(payload.request));

  const { data } = await axiosInstance.post<ParentStudentResponse>(
    "/api/v1/parent/student",
    formData
  );

  return data;
};


export const getAssociationTypes = async (): Promise<Record<string, string>> => {
  const response = await axiosInstance.get(
    "/api/v1/public/enumeration/association-type"
  );
  return response.data.data as Record<string, string>;
};


/** Study Levels ----------------------------------------------------------- */
export const getStudyLevels = async (): Promise<Record<string, string>> => {
  const { data } = await axiosInstance.get("/api/v1/public/enumeration/study-level");
  return data?.data ?? {};
};

