import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRestaurantAction } from '../../State/Restaurant/Action';
import RestaurantCard from '../Restaurant/RestaurantCard';
import "./Home.css";
import MultiItemCarous from './MultiItemCarous';

const restaurants = [1,1,1,1,1,1,1,1]

export const Home = () => {

  const dispatch = useDispatch();

  const jwt = localStorage.getItem('jwt');

  const {restaurant} = useSelector(store => store)
  console.log("restaurant: ",restaurant)

  useEffect(() => {
    dispatch(getAllRestaurantAction(jwt));
    
  }, [])



  return (
    <div className="pb-12">
      <section className="banner relative flex flex-col justify-center items-center">

         <div className='w-[90vw] md:w-[70vw] lg:w-[50vw] z-10 text-center'>
            <p className="text-3xl md:text-5xl lg:text-6xl font-extrabold z-10 py-4 tracking-tight">Hue Food</p>
            <p className="z-10 text-gray-300 text-lg md:text-2xl lg:text-3xl">Tận hưởng món ngon và dịch vụ tận tâm</p>
         </div>

         <div className='cover absolute inset-0'></div>
      </section>

      <section className='px-5 py-8 lg:py-12 lg:px-20'>
          <p className='text-xl md:text-2xl font-semibold text-gray-300 py-3'>Món nổi bật</p>
          <MultiItemCarous/>
      </section>

      <section className='px-5 lg:px-20'>
          <h1 className='text-xl md:text-2xl font-semibold text-gray-300 pb-4'>Đặt từ cửa hàng được yêu thích</h1>
          <div className='flex flex-wrap items-stretch justify-around gap-5'>
            {
              restaurant.restaurants.map((item)=>
                <RestaurantCard key={item.id} item = {item}/>
              )
            }
          </div>

      </section>
    </div>
  )
}

export default Home