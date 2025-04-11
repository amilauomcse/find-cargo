import React from "react";
import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://3.233.184.28:3003",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface InquiryData {
  type: string;
  method: string;
  portOfLoading: string;
  portOfDischarge: string;
  createdDate: string;
  offeredRate: number;
  clientName: string;
  clientContactNo: string;
  clientContactEmail: string;
  feedback: string;
  status: string;
  addedBy: string;
}

interface RatesData {
  agentName: string;
  etd: string;
  carrier: string;
  containerType: string;
  seaFreight: number;
  otherCost: number;
  exCost: number;
  total: number;
  transitTime: string;
  rateType: string;
  createdDate: string;
  type: string;
  loadingPort: string;
  dischargePort: string;
}

interface SalesCallData {
  companyName: string;
  contactedEmployee: string;
  contactNo: string;
  contactEmail: string;
  feedback: string;
  createdDate: string;
  followUpDate: string;
  agentName: string;
}

// Add a new inquiry
export const addInquiry = async (inquiryData: InquiryData) => {
  console.log("inquiry data: ", inquiryData);
  console.log(process.env.REACT_APP_BACKEND);

  try {
    const response = await api.post("/inquiries/add", inquiryData);
    return response.data;
  } catch (error) {
    console.error("Error adding inquiry:", error);
    throw error;
  }
};

// Get an Inquiry Data
export const getInquiries = async () => {
  try {
    const response = await api.get("/inquiries");
    return response.data;
  } catch (error) {
    console.log("Error fetching inquiry", error);
    throw error;
  }
};

// Add a new rate
export const addNewRate = async (ratesData: RatesData) => {
  try {
    const response = await api.post("/rates/add", ratesData);
    return response.data;
  } catch (error) {
    console.error("Error adding rates:", error);
    throw error;
  }
};

// Get rates
export const getRates = async () => {
  try {
    const response = await api.get("/rates");
    return response.data;
  } catch (error) {
    console.log("Error fetching rates", error);
    throw error;
  }
};
// Add a sales call
export const addSalesCall = async (salesCallData: SalesCallData) => {
  try {
    const response = await api.post("/salesCalls/add", salesCallData);
    return response.data;
  } catch (error) {
    console.error("Error adding sales call:", error);
    throw error;
  }
};

// Get sales calls
export const getSalesCalls = async () => {
  try {
    const response = await api.get("/salesCalls");
    return response.data;
  } catch (error) {
    console.log("Error fetching sales calls", error);
    throw error;
  }
};
