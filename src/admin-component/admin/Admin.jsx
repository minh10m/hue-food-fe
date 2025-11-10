import { Route, Routes } from "react-router-dom";
import { AdminSideBar } from "./AdminSideBar";
import { Orders } from "../orders/Orders";
import { Menu } from "../menu/Menu";
import { FoodCategory } from "../food-category/FoodCategory";
import { Ingredients } from "../ingredients/Ingredients";
import { RestaurantDetails } from "./RestaurantDetails";
import { RestaurantDashboard } from "../dashboard/RestaurantDashboard";
import { CreateMenuForm } from "../menu/CreateMenuForm";
import { EventPage } from "../events/EventPage";

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
            <Route path="/event" element={<EventPage/>} />
            <Route path="/details" element={<RestaurantDetails />} />
            <Route path="/add-menu" element={<CreateMenuForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
