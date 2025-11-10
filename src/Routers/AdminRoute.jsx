import { Route, Routes, Navigate } from "react-router-dom";
import { Admin } from "../admin-component/admin/Admin";
import { CreateRestaurantForm } from "../admin-component/restaurant/CreateRestaurantForm";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getRestaurantByUserId } from "../State/Restaurant/Action";
import { CircularProgress, Box } from "@mui/material";

export const AdminRoute = () => {
  const dispatch = useDispatch();
  const { usersRestaurant} = useSelector(s => s.restaurant);
  const role = useSelector(s => s.auth?.role) || localStorage.getItem("role");

  useEffect(() => {
    if (role === "ROLE_RESTAURANT_OWNER" && usersRestaurant === null) {
      dispatch(getRestaurantByUserId());
    }
  }, [dispatch, role, usersRestaurant]);

  if (!role || role !== "ROLE_RESTAURANT_OWNER") {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route
        path="/*"
        element={usersRestaurant ? <Admin /> : <CreateRestaurantForm />}
      />
    </Routes>
  );
};
