import * as Yup from "yup";

// ✅ 1. Yup validation schema (this is the actual value used in Formik)
export const signupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().matches(/^\d{10}$/, "Phone must be 10 digits").required("Phone is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

// ✅ 2. TypeScript type
export type SignupSchema = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};
