
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import StoreOwnerDashboard from "./components/StoreOwnerDashboard";
import Home from "./components/Home";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={<Login />} />   */}
        <Route path="/signup" element={<Signup />} />

        {/* Role-based dashboards */}
        <Route
          path="/admin-dashboard"
          element={
            user?.role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/user-dashboard"
          element={
            user?.role === "USER" ? <UserDashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/store-owner-dashboard"
          element={
            user?.role === "OWNER" ? (
              <StoreOwnerDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

