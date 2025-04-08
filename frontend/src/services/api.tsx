import React from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:3000",
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
  rateOffered: string;
  clientName: string;
  clientContact: string;
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
  createdDate: string;
  transitTime: string;
  type: string;
}

interface SalesCallData {
  customerName: string;
  contacts: string;
  contactedEmployee: string;
  createdDate: string;
  feedback: string;
  nextFollowupDate: string;
}

// Add a new inquiry
export const addInquiry = async (inquiryData: InquiryData) => {
  try {
    const response = await api.post("/inquery/add", inquiryData);
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
