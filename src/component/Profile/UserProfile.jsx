import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../State/Authentication/Action';

const UserProfile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('log out');
    dispatch(logout());
    navigate("/");
  }

  const jwt = localStorage.getItem('jwt');
  const {auth} = useSelector(store => store)

  useEffect(() => {
    dispatch(getUser(jwt));
  }, [])

  return (
    <div className='min-h-[80vh] flex flex-col justify-center items-center text-center px-5'>
      <div className='flex flex-col items-center justify-center max-w-md w-full'>
        <div className="relative mb-6">
          <AccountCircleIcon sx={{fontSize:"8rem", color: 'primary.main'}}/>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background.paper"></div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 w-full border border-gray-700/50">
          <h1 className='text-3xl font-bold text-gray-100 mb-2'>{auth.user?.fullName}</h1>
          <p className="text-gray-400 mb-6">{auth.user?.email}</p>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Vai trò</span>
              <span className="text-gray-100 font-medium">
                {auth.user?.role === 'ROLE_CUSTOMER' ? 'Khách hàng' : 'Chủ cửa hàng'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Thành viên từ</span>
              <span className="text-gray-100 font-medium">Tháng 1, 2024</span>
            </div>
          </div>
          
          <Button 
            onClick={() => handleLogout()} 
            variant='contained' 
            sx={{
              marginTop: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              width: '100%'
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile