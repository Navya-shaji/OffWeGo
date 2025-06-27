import Signup from "@/pages/User/Auth/signup"
import Home from "@/pages/User/Home/Home"
import { Route, Routes } from "react-router-dom"

 const UserRoute=()=>{
    return (
        <Routes>
            <Route path="/signup" element={<Signup/>}/>
             <Route path="/home" element={<Home/>}/>
        </Routes>
    )
}
export default UserRoute