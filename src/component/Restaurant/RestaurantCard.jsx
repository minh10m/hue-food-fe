import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Card, Chip, IconButton } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToFavorite } from '../../State/Authentication/Action';
import { isPresentInFavorites } from '../config/logic';


const RestaurantCard = ({item}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const { auth } = useSelector(store => store)

  const handleAddToFavorites = () => {
    dispatch(addToFavorite(jwt, item.id))
  } 

  const handleNavigateToRestaurant = () => {
    if(item.open){
      navigate(`/restaurant/${item.address.city}/${item.name}/${item.id}`)
    }
  }
  return (
    <Card  
      className='w-[18rem] hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
      sx={{ 
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
        <div 
          onClick={handleNavigateToRestaurant} 
          className={`${item.open ? 'cursor-pointer' : "cursor-not-allowed"} relative group`}
        >
          <img
            className='w-full h-[12rem] object-cover group-hover:scale-105 transition-transform duration-300' 
            src={item.images[0]}
            alt={item.name} 
          />
          <Chip 
            size='small' 
            className='absolute top-3 left-3'
            color={item.open ? "success" : "error"}
            label={item.open ? "Đang mở" : "Đóng cửa"}
            sx={{ 
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
              backgroundColor: item.open ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
              color: 'white'
            }}
          />
        </div>

        <div className='p-5'>
          <div className='flex justify-between items-start mb-3'>
            <div className='flex-1'>
              <h3 
                onClick={handleNavigateToRestaurant}
                className="font-bold text-xl cursor-pointer text-gray-100 hover:text-primary.main transition-colors"
              >
                {item.name}
              </h3>
              <p className='text-gray-400 text-sm mt-1 line-clamp-2'>
                {item.description}
              </p>
            </div>

            <IconButton 
              onClick={handleAddToFavorites}
              sx={{ 
                color: isPresentInFavorites(auth.favorites, item) ? 'primary.main' : 'text.secondary',
                '&:hover': { 
                  backgroundColor: 'rgba(233, 30, 99, 0.1)',
                  color: 'primary.main'
                }
              }}
            >
              {isPresentInFavorites(auth.favorites, item) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>⭐ 4.5</span>
            <span>•</span>
            <span>30-45 phút</span>
          </div>
        </div>
    </Card>
  )
}

export default RestaurantCard