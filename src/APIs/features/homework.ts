import axiosInstance from "../axios";


export const fetchAllHomeWorks = async (studentId: string, date: string): Promise<any> => {
    const response = await axiosInstance.get<any>(`/api/v1/parent/student-homeworks?date=${date}&studentId=${studentId}&size=1000000&page=0&getActive=1`);
    return response.data;
  };
export const fetchAllMaterials = async (studentId: string, date: string): Promise<any> => {
    const response = await axiosInstance.get<any>(`/api/v1/parent/student-materials?date=${date}&studentId=${studentId}&size=1000000&page=0`);
    return response.data;
  };
export const fetchAllAttendances = async (studentId: string, date: string): Promise<any> => {
    const response = await axiosInstance.get<any>(`/api/v1/parent/student-sessions-attendance?date=${date}&studentId=${studentId}`);
    return response.data;
  };
export const fetchAllAttendancesSummary = async (studentId: string): Promise<any> => {
    const response = await axiosInstance.get<any>(`/api/v1/parent/student-attendance-summary?studentId=${studentId}`);
    return response.data;
  };
export const fetchAllschedule = async (studentId: string, date: string): Promise<any> => {
    const response = await axiosInstance.get<any>(`/api/v1/parent/student-schedule?date=${date}&studentId=${studentId}`);
    return response.data;
  };