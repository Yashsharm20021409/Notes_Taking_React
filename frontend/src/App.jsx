import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "../protected_route";
import Cookies from "js-cookie"
import { useEffect, useState } from "react";

// const routes = (

// );

const App = () => {
  // const isAuthenticated = Cookies.get('token');
  // const [check,setCheck] = useState(false);
  // useEffect(()=>{
    
  //   if(isAuthenticated){
  //     setCheck(true);
  //   }
  //   else{
  //     setCheck(false);
  //   }
  // })
  return (
    // <BrowserRouter>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/login" element={ <Login/>} />
          <Route path="/register" element={ <Signup/>} />
        </Routes>
      </Router>
    // </BrowserRouter>
  );
};

export default App;
