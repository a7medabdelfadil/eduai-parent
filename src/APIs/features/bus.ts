import axiosInstance from "../axios";

export type Region = {
  id: number;
  name: string;
};

export type MyRegion = {
  id: number;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  zipCode?: string | null;
};

type RegionResponse = {
  success: boolean;
  message: string;
  data: Region[];
};

export type SubscriptionInfo = {
  semesterId: number;
  regionId: number;
  regionName: string;
  cityName: string;
  cost: number;
  about: string;
  currency: string;
  semesterStart: string;
  semesterEnd: string;
};

type BusSubscriptionRequest = {
  riderId: number;
  regionId: number;
  notes?: string;
  homeLocation: {
    latitude: number;
    longitude: number;
  };
};

export type BusInfo = {
  driverName: string;
  busNumber: string;
  speed: number;
  phoneNumber: {
    countryCode: number;
    nationalNumber: string;
  };
};

export const fetchAllRegions = async (): Promise<Region[]> => {
  const response = await axiosInstance.get<RegionResponse>(`/api/v1/location/public/region`);
  return response.data.data;
};

export const fetchMyRegion = async (): Promise<MyRegion> => {
  const response = await axiosInstance.get<{ data: MyRegion }>(`/api/v1/user/my-region`);
  return response.data.data;
};

export const fetchBusSubscriptionInfo = async (
  regionId: number
): Promise<SubscriptionInfo> => {
  const response = await axiosInstance.get<{ data: SubscriptionInfo }>(
    `/api/v1/bus-subscription/fees-and-period/${regionId}`
  );
  return response.data.data;
};

export const fetchStudentBusId = async (studentId: string): Promise<string> => {
  const res = await axiosInstance.get<{ data: number }>(
    `/api/v1/bus/student/${studentId}/bus`
  );
  return res.data.data.toString();
};

export const fetchSubscribeStudentToBus = async (data: BusSubscriptionRequest): Promise<void> => {
  await axiosInstance.post(`/api/v1/bus-subscription/student`, data);
};

export const fetchBusInfo = async (busId: number): Promise<BusInfo> => {
  const response = await axiosInstance.get<{ data: BusInfo }>(
    `/api/v1/bus/bus-info`,
    { params: { busId } }
  );
  return response.data.data;
};