import { AddReaction } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventIcon from '@mui/icons-material/Event';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Divider, Drawer, useMediaQuery } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../State/Authentication/Action';

const menu = [
  {
    title:"Orders", icon: <ShoppingBagIcon/>
  },
  {
    title:"Favorites", icon: <FavoriteIcon/>
  },
  {
    title:"Address", icon: <AddReaction/>
  },
  {
    title:"Payments", icon: <AccountBalanceWalletIcon/>
  },
  {
    title:"Notifications", icon: <NotificationsIcon/>
  },
  {
    title:"Events", icon: <EventIcon/>
  },
  {
    title:"Logout", icon: <LogoutIcon/>
  }
]

const ProfileNavigation = (open, handleClose) => {
  const isSmallScreen = useMediaQuery("(max-width:900px)")
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (item) => {
    if(item.title === "Logout"){
      dispatch(logout());
      navigate("/");
    }
    else navigate(`/my-profile/${item.title.toLowerCase()}`);
  }
  return (
    <div>
      <Drawer 
      variant={isSmallScreen?"temporary":"permanent"} 
      onClose={handleClose} 
      open={isSmallScreen?open:true} 
      anchor='left' 
      sx={{zIndex: 1}}>
        <div className='sticky w-[50vw] lg:w-[20vw] h-[110vh] flex flex-col justify-center text-xl gap-7 pt-16 mt-5'>
          {
            menu.map((item, index) => <>
            <div onClick={() => handleNavigate(item)} className=' px-5 flex items-center space-x-5 cursor-pointer'>
              {item.icon}
              <span>{item.title}</span>
            </div>

            {index !== menu.length - 1 && <Divider/>}
            </>
            )
          }
        </div>
      </Drawer>
    </div>
  )
}

export default ProfileNavigation