import axiosInstance from "@/axios/instance";


export const adminLogin=async(email:string,password:string)=>{
    const response=await axiosInstance.post("admin/login",{
        email,
        password
    })
    return response.data.admin
}