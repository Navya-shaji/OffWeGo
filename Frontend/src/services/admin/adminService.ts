import axiosInstance from "@/axios/instance";
export const adminLogin=async(email:string,password:string)=>{
    const response=await axiosInstance.post("admin/login",{
        email,
        password
    })
    return response.data
}
export const getVendorsByStatus = async (
  status: "pending" | "approved" | "rejected"
) => {
  const response = await axiosInstance.get(`/admin/vendors/status/${status}`);
  return response.data.vendors; 
};


export const getPendingVendors = async () => {
  const response = await axiosInstance.get("/admin/vendors/pending");
  return response.data.vendors; 
};

export const updateVendorStatus = async (vendorId: string, status: "approved" | "rejected") => {
  const response = await axiosInstance.patch(`/admin/vendors/status/${vendorId}`, {
    status,
  });
  return response.data;
};
