import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./routes/userRouters";
import { Suspense, lazy } from "react";
import AdminRouter from "./routes/adminRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <BrowserRouter>
  <ToastContainer
          position="top-right"
          autoClose={1500} // Adjust the duration for the toast to be displayed in milliseconds
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />   
      <Routes>
        <Route path="/*" element={<UserRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
