import { Routes, Route } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import UserProfilePage from "./pages/UserProfilePage";

const EmptyRoute = () => null;

const UserRoutes = () => (
  <Routes>
    <Route path="/user" element={<UserDashboard />} />
    <Route path="/user/profile" element={<UserProfilePage />} />
    <Route path="*" element={<EmptyRoute />} />
  </Routes>
);

export default UserRoutes;
