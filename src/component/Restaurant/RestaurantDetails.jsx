import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getMenuItemsByRestaurantId } from '../../State/Menu/Action';
import { getRestaurantId, getRestaurantsCategory } from '../../State/Restaurant/Action';
import MenuCard from './MenuCard';


const foodTypes =[
  {label:"All", value: "all"},
  {label:"Vegetarian only", value: "vegetarian"},
  {label:"Non-Vegetarian", value: "non-vegetarian"},
  {label:"Seasonal", value: "seasonal"},
]

const RestaurantDetails = () => {
  const [foodType, setFoodType] = useState("all")

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const { auth, restaurant, menu } = useSelector(store => store)

  const [selectedCategory, setSelectedCategory] = useState("");

  const {id, city} = useParams();

  const handleFilter = (e) => {
    setFoodType(e.target.value)
  }

  const handleFilterCategory = (e, value) => {
    setSelectedCategory(value);
  }

  useEffect(() => {
    dispatch(getRestaurantId({restaurantId: id}));
    dispatch(getRestaurantsCategory({restaurantId: id}));
  }, []);


  useEffect(() => {
    dispatch(getMenuItemsByRestaurantId({
      jwt, 
      restaurantId: id, 
      vegetarian: foodType === "vegetarian", 
      nonVeg: foodType === "non-vegetarian", 
      seasonal: foodType === "seasonal", 
      foodCategory: selectedCategory
    }))
  }, [selectedCategory, foodType])

  return (
    <div className='px-5 lg:px-20'>

      <section>
         <div className='text-gray-400 py-3 mt-8 text-sm'>
            <span className="hover:text-gray-300 cursor-pointer">Trang chủ</span>
            <span className="mx-2">/</span>
            <span className="hover:text-gray-300 cursor-pointer">Huế</span>
            <span className="mx-2">/</span>
            <span className="hover:text-gray-300 cursor-pointer">Ẩm thực Huế</span>
            <span className="mx-2">/</span>
            <span className="text-gray-300">{restaurant.restaurant?.name}</span>
         </div>
         
         <div className="relative">
          <Grid container spacing={2}>
            <Grid item xs={12}>
                <img 
                  className='w-full h-[50vh] object-cover rounded-2xl' 
                  src="https://i.pinimg.com/736x/b6/75/98/b675986a4671c0ac0ce5f1867805e06f.jpg" 
                  alt="Restaurant banner" 
                />
            </Grid>

            <Grid item xs={12}>
                <img 
                  className='w-full h-[25vh] object-cover rounded-xl' 
                  src={restaurant.restaurant?.image} 
                  alt="Restaurant" 
                />
            </Grid>
          </Grid>
         </div>
         
         <div className='pt-6 pb-8'>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className='text-5xl font-bold text-gray-100 mb-3'> {restaurant.restaurant?.name} </h1>
                <p className='text-gray-400 text-lg leading-relaxed mb-4'>{restaurant.restaurant?.description}</p>
              </div>
              <div className="ml-6 text-right">
                <div className="text-2xl font-bold text-green-400 mb-1">⭐ 4.5</div>
                <div className="text-sm text-gray-500">Đánh giá trung bình</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className='flex items-center gap-3 text-gray-400'>
                <LocationOnIcon sx={{ color: 'primary.main' }}/>
                <span className="text-gray-300">
                  2 Trần Hưng Đạo, Phú Hoà, Thành phố Huế, Thừa Thiên Huế
                </span>
              </div>

              <div className='flex items-center gap-3 text-gray-400'>
                <CalendarTodayIcon sx={{ color: 'primary.main' }}/>
                <span className="text-gray-300">
                  Thứ 2 - Chủ nhật: 7:00 - 24:00
                </span>
              </div>
            </div>
         </div>
      </section>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />
      <section className='pt-8 lg:flex relative'>

        <div className='lg:w-[25%] filter'>
          <div className='bg-gray-800/30 backdrop-blur rounded-2xl p-6 lg:sticky top-8'>
            <div className="mb-8">
              <Typography variant='h6' sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}>
                Loại món ăn
              </Typography>

              <FormControl component={"fieldset"}>
                <RadioGroup 
                  onChange={handleFilter} 
                  name='food_type' 
                  value={foodType}
                  sx={{ gap: 1 }}
                >
                  {
                    foodTypes.map((item) => (
                      <FormControlLabel 
                        key={item.value} 
                        value={item.value} 
                        control={<Radio sx={{ color: 'primary.main' }} />} 
                        label={<span className="text-gray-300">{item.label}</span>} 
                      />
                    ))
                  }
                </RadioGroup>
              </FormControl>
            </div>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />    
            
            <div>
              <Typography variant='h6' sx={{ color: 'text.primary', fontWeight: 700, mb: 3 }}>
                Danh mục món ăn
              </Typography>

              <FormControl component={"fieldset"}>
                <RadioGroup 
                  onChange={handleFilterCategory} 
                  name='food_category' 
                  value={selectedCategory}
                  sx={{ gap: 1 }}
                >
                  {
                    restaurant.categories?.map((item) => (
                      <FormControlLabel 
                        key={item.name} 
                        value={item.name} 
                        control={<Radio sx={{ color: 'primary.main' }} />} 
                        label={<span className="text-gray-300">{item.name}</span>} 
                      />
                    ))
                  }
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>

        <div className='lg:w-[75%] lg:pl-8'>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Thực đơn</h2>
            <p className="text-gray-400">{menu.menuItems?.length || 0} món ăn có sẵn</p>
          </div>
          
          <div className='space-y-4'>
            {
              menu.menuItems?.map((item, index) => (
                <MenuCard key={item.id || index} item={item} />
              ))
            }
          </div>
        </div>
      </section>

    </div>
  )
}

export default RestaurantDetails