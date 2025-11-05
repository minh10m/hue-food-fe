import { Route, Routes } from "react-router-dom";
import { AdminSideBar } from "./AdminSideBar";
import { Dashboard } from "@mui/icons-material";
import { Orders } from "../orders/Orders";
import { Menu } from "../menu/Menu";
import { FoodCategory } from "../food-category/FoodCategory";
import { Ingredients } from "../ingredients/Ingredients";
import { Events } from "../events/Events";
import { RestaurantDetails } from "./RestaurantDetails";
import { RestaurantDashboard } from "../dashboard/RestaurantDashboard";

export const Admin = () => {
  const handleClose = () => {};
  return (
    <div>
      <div className="lg:flex justify-between">
        <div>
          <AdminSideBar handleClose={handleClose} />
        </div>
        <div className="lg:w-[80%]">
          <Routes>
            <Route path="/" element={<RestaurantDashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/category" element={<FoodCategory />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/events" element={<Events />} />
            <Route path="/details" element={<RestaurantDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
