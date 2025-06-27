
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import  { Toaster } from 'react-hot-toast';

import UserRoute from './Routes/user/userRoutes';

function App() {
 
const route=createBrowserRouter([{
  path:'/*',element:<UserRoute/>
},
{
  // path:"/admin/*",
}])

  return (
    <>
    <RouterProvider router={route}/>
            <Toaster />

    </>
  )
}

export default App
