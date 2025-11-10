import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createIngredientCategory } from "../../State/ingredients/Action";

export const CreateIngredientsCategoryForm = () => {
  const dispatch = useDispatch();
  const restaurantId = useSelector((s) => s.restaurant?.usersRestaurant?.id); 

  const [formData, setFormData] = useState({ name: "" });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!restaurantId) {
      return console.warn("Missing restaurantId. Make sure you loaded getRestaurantByUserId()");
    }
    dispatch(
      createIngredientCategory({
        data: { name: formData.name.trim(), restaurantId },
      }),
    );
    setFormData({ name: "" })
  };

  return (
    <div className="p-5">
      <h1 className="text-gray-400 text-center text-xl pb-10">Create Ingredient Category</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Category Name"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.name}
          required
        />
        <Button fullWidth variant="contained" type="submit" color="primary" className="mt-5">
          Create
        </Button>
      </form>
    </div>
  );
};
