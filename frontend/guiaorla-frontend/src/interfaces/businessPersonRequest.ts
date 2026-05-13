import { BusinessResponse, CreateBusinessRequest } from "./businessRequest";

export interface CreateBusinesspersonRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  business: CreateBusinessRequest;
}

export interface BusinesspersonResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  business?: BusinessResponse;
}