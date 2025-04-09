import axiosInstance from "../axios";
import { type EventsResponse } from "../../types";

export const fetchUpcomingEvents = async (): Promise<EventsResponse> => {
  const response = await axiosInstance.get<EventsResponse>("/api/v1/dashboard/upcoming-events");
  return response.data;
};

export const fetchStudentUpcomingEvents = async (studentId: string): Promise<any> => {
  const response = await axiosInstance.get<any>(`/api/v1/parent/upcoming-events?Size=1000000&page=0&getActive=1&studentId=${studentId}`);
  return response.data;
};

export const addAttendance = async (eventId: string): Promise<void> => {
  await axiosInstance.put(`/api/v1/event-attendance/add-myself?eventId=${eventId}`);
};

export const removeAttendance = async (eventId: string): Promise<void> => {
  await axiosInstance.put(`/api/v1/event-attendance/remove-myself?eventId=${eventId}`);
};

