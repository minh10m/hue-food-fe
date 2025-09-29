// ProfileNavigation.tsx
import React from 'react';
import { Divider, Drawer, useMediaQuery, useTheme } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AddReaction } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../State/Authentication/Action';

const menu = [
  { title: 'Orders',        icon: <ShoppingBagIcon/> },
  { title: 'Favorites',     icon: <FavoriteIcon/> },
  { title: 'Address',       icon: <AddReaction/> },
  { title: 'Payments',      icon: <AccountBalanceWalletIcon/> },
  { title: 'Events',        icon: <EventIcon/> },
  { title: 'Logout',        icon: <LogoutIcon/> },
];

const ProfileNavigation = ({ open = false, onClose }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery('(max-width:900px)');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // chiều cao navbar: 60 (xs) / 64 (md+)
  const navHMobile = 60;
  const navHDesktop = 64;

  const handleNavigate = (item) => {
    if (item.title === 'Logout') {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");
      dispatch(logout());
      navigate('/');
      onClose?.();
      return;
    }
    navigate(`/my-profile/${item.title.toLowerCase()}`);
    onClose?.();
  };

  return (
    <Drawer
      variant={isSmall ? 'temporary' : 'permanent'}
      open={isSmall ? open : true}
      onClose={onClose}
      anchor="left"
      ModalProps={{ keepMounted: true }}
      sx={{
        // Quan trọng: đẩy ngăn kéo xuống dưới navbar & set chiều cao còn lại
        zIndex: (t) => t.zIndex.appBar - 1,
        '& .MuiDrawer-paper': {
          top: { xs: navHMobile, md: navHDesktop },
          height: { xs: `calc(100% - ${navHMobile}px)`, md: `calc(100% - ${navHDesktop}px)` },
          // chiều rộng giống cũ
          width: { xs: '50vw', lg: '20vw' },
          backgroundColor: 'rgba(15,15,18,0.9)',
          backdropFilter: 'blur(6px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden', // ẩn phần giấy, container bên trong tự scroll
        },
      }}
    >
      {/* container bên trong tự cuộn */}
      <div className="h-full overflow-auto flex flex-col justify-start text-lg gap-2 pt-6 px-4">
        {menu.map((item, idx) => (
          <React.Fragment key={item.title}>
            <div
              onClick={() => handleNavigate(item)}
              className="px-4 py-3 flex items-center space-x-4 cursor-pointer rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
            >
              <span className="text-gray-400">{item.icon}</span>
              <span className="text-gray-200 font-medium">{item.title}</span>
            </div>
            {idx !== menu.length - 1 && (
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </Drawer>
  );
};

export default ProfileNavigation;
