import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PropertyEdit from "./pages/PropertyEdit";
import PropertyView from "./pages/PropertyView";
import PropertyAdd from "./pages/PrrpertyAdd";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/add-property" element={<PropertyAdd />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/edit-property" element={<PropertyEdit />} />
        <Route path="/view-property" element={<PropertyView />} />
        <Route
          path="*"
          element={<div className="p-8 text-center">404 - Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
