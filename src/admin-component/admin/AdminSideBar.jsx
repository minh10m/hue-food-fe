import { Dashboard, ShoppingBag } from "@mui/icons-material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LogoutIcon from "@mui/icons-material/Logout";
import ShopTwoIcon from "@mui/icons-material/ShopTwo";
import { Divider, Drawer, useMediaQuery } from "@mui/material";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../State/Authentication/Action";

const menu = [
  { title: "Dashboard", icon: <Dashboard />, path: "/" },
  { title: "Orders", icon: <ShoppingBag />, path: "/orders" },
  { title: "Menu", icon: <ShopTwoIcon />, path: "/menu" },
  { title: "Food Category", icon: <CategoryIcon />, path: "/category" },
  { title: "Ingredients", icon: <FastfoodIcon />, path: "/ingredients" },
  { title: "Events", icon: <EventIcon />, path: "/event" },
  { title: "Details", icon: <AdminPanelSettingsIcon />, path: "/details" },
  { title: "Logout", icon: <LogoutIcon />, path: "/logout" }, // xử lý riêng
];

export const AdminSideBar = ({ handleClose = () => {} }) => {
  // ✅ hook phải được GỌI trong thân component
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const base = "/admin/restaurants";

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      dispatch(logout());
      navigate("/");            // điều hướng sau khi logout
    } else {
      const to = item.path === "/" ? base : `${base}${item.path}`;
      navigate(to);
    }
    if (isSmallScreen) handleClose(); // chỉ đóng trên mobile
  };

  return (
    <div>
      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        onClose={handleClose}
        open={true}
        anchor="left"
        sx={{ zIndex: 1 }}
      >
        <div className="w-[70vw] lg:w-[20vw] h-screen flex flex-col justify-center text-xl space-y-[1.65rem]">
          {menu.map((item, i) => (
            // ✅ luôn có key khi lặp
            <React.Fragment key={item.path || i}>
              <div
                onClick={() => handleNavigate(item)}
                className="px-5 flex items-center gap-5 cursor-pointer hover:opacity-80"
              >
                {item.icon}
                <span>{item.title}</span>
              </div>
              {i !== menu.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </Drawer>
    </div>
  );
};
