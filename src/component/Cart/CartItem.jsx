import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Chip, IconButton } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { updateCartItem, removeCartItem } from "../../State/Cart/Action";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleUpdateCartItem = (delta) => {
    // Nếu giảm xuống 0 thì xoá luôn
    if (delta === -1 && item.quantity === 1) {
      dispatch(removeCartItem(item.id));
      return;
    }

    const nextQty = item.quantity + delta;
    if (nextQty < 1) return; // an toàn

    // Action mới nhận { cartItemId, quantity } (không bọc trong data, không cần jwt)
    dispatch(updateCartItem({ cartItemId: item.id, quantity: nextQty }));
  };

  const handleRemoveCartItem = () => {
    // Action mới nhận trực tiếp cartItemId
    dispatch(removeCartItem(item.id));
  };

  return (
    <div className="px-5 py-4 border-b border-gray-800/50 last:border-b-0">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            className="w-16 h-16 rounded-lg object-cover"
            src={item.food?.images?.[0]}
            alt={item.food?.name || "Food"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-100 text-lg">
                {item.food?.name}
              </h3>

              <div className="flex items-center space-x-2 mt-2">
                <IconButton
                  size="small"
                  onClick={() => handleUpdateCartItem(-1)}
                  sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                >
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>

                <span className="w-8 text-center font-medium text-gray-300">
                  {item.quantity}
                </span>

                <IconButton
                  size="small"
                  onClick={() => handleUpdateCartItem(1)}
                  sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                </IconButton>
              </div>
            </div>

            <div className="text-right ml-4">
              <p className="font-semibold text-lg text-gray-100">
                {(item.totalPrice / 1000).toLocaleString()}.000VND
              </p>
              <button
                onClick={handleRemoveCartItem}
                className="text-xs text-red-400 hover:text-red-300 mt-1"
              >
                Xoá
              </button>
            </div>
          </div>

          {Array.isArray(item.ingredients) && item.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.ingredients.map((ingredient, idx) => (
                <Chip
                  key={idx}
                  label={ingredient}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(233, 30, 99, 0.1)",
                    color: "primary.main",
                    fontSize: "0.75rem",
                    height: 20,
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
