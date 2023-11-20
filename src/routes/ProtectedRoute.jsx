import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import NavBar from "../components/NavBar";

export const ProtectedRoute = () => {
  const { token } = useAuth();

  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
