import axiosInstance from "../axios";
import type { ComplainsResponse, ComplaintResponse } from "../../types";

export const fetchAllComplains = async (): Promise<ComplainsResponse> => {
    const response = await axiosInstance.get<ComplainsResponse>(
        `/api/v1/complain/all?size=1000000&page=0`
    );
    return response.data;
};

export const createComplaint = async (formData: ComplaintResponse): Promise<any> => {
  // Create FormData and append the 'complain' key
  const form = new FormData();
  form.append("complain", JSON.stringify(formData));

  // Send the formData with proper headers
  const response = await axiosInstance.post("/api/v1/complain/parent", form, {
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
  return response.data;
};
