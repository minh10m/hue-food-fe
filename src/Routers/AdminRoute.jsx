import { Route, Routes } from 'react-router-dom';
import { Admin } from '../admin-component/admin/Admin';
import { CreateRestaurantForm } from '../admin-component/restaurant/CreateRestaurantForm';

export const AdminRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={false?<CreateRestaurantForm/>:<Admin/>} />
      </Routes>
    </div>
  );
};
