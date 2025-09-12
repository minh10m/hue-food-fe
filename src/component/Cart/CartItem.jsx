import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Chip, IconButton } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeCartItem, updateCartItem } from "../../State/Cart/Action";
const CartItem = ({item}) => {  

  const {auth, cart} = useSelector((store) => store)

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const jwt = localStorage.getItem('jwt');

  const handleUpdateCartItem = (value) => {
    if (value === -1 && item.quantity === 1){
      handleRemoveCartItem()
    } 
    const data = {
      cartItemId: item.id,
      quantity: item.quantity + value,
    }

    console.log("data",data)

    dispatch(updateCartItem({data, jwt}))
  }

  const handleRemoveCartItem = () => {
    dispatch(removeCartItem({cartItemId: item.id, jwt: auth.jwt || jwt}))
  }

  return (
    <div className="px-5 py-4 border-b border-gray-800/50 last:border-b-0">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            className="w-16 h-16 rounded-lg object-cover"
            src={item.food.images[0]}
            alt={item.food.name}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-100 text-lg">{item.food.name}</h3>
              <div className="flex items-center space-x-2 mt-2">
                <IconButton 
                  size="small" 
                  onClick={() => handleUpdateCartItem(-1)}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>

                <span className="w-8 text-center font-medium text-gray-300">
                  {item.quantity}
                </span>

                <IconButton 
                  size="small" 
                  onClick={() => handleUpdateCartItem(1)}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
            
            <div className="text-right ml-4">
              <p className="font-semibold text-lg text-gray-100">
                {(item.totalPrice/1000).toLocaleString()}.000đ
              </p>
            </div>
          </div>
          
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.ingredients.map((ingredient, index) => (
                <Chip 
                  key={index}
                  label={ingredient} 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(233, 30, 99, 0.1)', 
                    color: 'primary.main',
                    fontSize: '0.75rem',
                    height: 20
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
