import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import SignIn from "./Pages/SignIn";
import ProtectedRoute from "./Pages/ProtectedRoute";

import CreatePost from "./Components/CreatePost";
import Main from "./Pages/Main";
import Profile from "./Components/ProfileComponent/Profile";
import MainSection from "./Components/MainSection";
import Notification from "./Components/ProfileComponent/Notification";
import ForgetPassword from "./Pages/ForgetPassword";


function App() {
  return (
   <>
   <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/sign" element={<SignIn/>}/>
        <Route path="/forget" element={<ForgetPassword/>}/>
        <Route element={<ProtectedRoute/>}>
        <Route element={<Main/>}>
          <Route path="/main" element={<MainSection/>}></Route>
          <Route path="/createpost" element={<CreatePost/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/profile/:id" element={<Profile/>}></Route>
          </Route>
          <Route path="/notification" element={<Notification/>}></Route>
          
        
        </Route>
   </Routes>
    
   </>
  );
}

export default App;
