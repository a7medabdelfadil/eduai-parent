import axiosInstance from "../axios";
import type { LessonPageResponse, StudyStageResponse, SubjectSummaryResponse } from "../../types";

export const fetchAllTextBookSummary = async (): Promise<SubjectSummaryResponse> => {
    const response = await axiosInstance.get<SubjectSummaryResponse>(
        `/api/v1/parent-textbook/summary`
    );
    return response.data;
};

export const fetchStudyStageBySubject = async (subject: string): Promise<StudyStageResponse> => {
    const response = await axiosInstance.get<StudyStageResponse>(`/api/v1/parent-textbook/study-levels?subject=${subject}`);
    return response.data;
};

export const fetchLessonsByCourseId = async (courseId: number): Promise<LessonPageResponse> => {
    const response = await axiosInstance.get<LessonPageResponse>(`/api/v1/parent-textbook/lessons?size=1000000&page=0&courseId=${courseId}`);
    return response.data;
};
