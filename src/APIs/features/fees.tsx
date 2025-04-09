import axiosInstance from "../axios";
import type { FeesResponse } from "../../types";

export const fetchAllFees = async (studentId: string): Promise<FeesResponse> => {
    const response = await axiosInstance.get<FeesResponse>(
        `/api/v1/fees/all?studentId=${studentId}`
    );
    return response.data;
};