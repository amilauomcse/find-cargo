import axios from "axios";

// Debug logging
console.log("=== API Configuration Debug ===");
console.log("import.meta:", import.meta);
console.log("import.meta.env:", import.meta?.env);
console.log("VITE_BACKEND_URL from env:", import.meta?.env?.VITE_BACKEND_URL);

// Ensure we have a valid URL with protocol
const getBackendUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Try to get from window object (for runtime injection)
    const windowBackendUrl = (window as any).__BACKEND_URL__;
    if (windowBackendUrl) {
      console.log("Using backend URL from window:", windowBackendUrl);
      return windowBackendUrl;
    }
  }

  const envUrl = import.meta?.env?.VITE_BACKEND_URL;
  console.log("Raw env URL:", envUrl);

  if (!envUrl) {
    console.log("No VITE_BACKEND_URL found, using default");
    // For Docker environment, use the backend service name
    return "http://api:3000";
  }

  // If the URL doesn't start with http:// or https://, add http://
  if (!envUrl.startsWith("http://") && !envUrl.startsWith("https://")) {
    console.log("Adding http:// protocol to URL");
    return `http://${envUrl}`;
  }

  return envUrl;
};

const backendUrl = getBackendUrl();
console.log("Final backend URL:", backendUrl);

const api = axios.create({
  baseURL: backendUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("API baseURL set to:", api.defaults.baseURL);
console.log("=== End API Configuration Debug ===");

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
  console.log(import.meta.env.VITE_BACKEND_URL);

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
    console.log(api.defaults.baseURL);
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
