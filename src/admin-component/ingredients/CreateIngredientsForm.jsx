import {
  Button, FormControl, InputLabel, MenuItem, Select, TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createIngredient } from "../../State/ingredients/Action";

export const CreateIngredientsForm = () => {
  const dispatch = useDispatch();
  const restaurantId = useSelector((s) => s.restaurant?.usersRestaurant?.id);
  const ingredientCategories = useSelector((s) => s.ingredients?.category) || []; 

  const [formData, setFormData] = useState({
    name: "",
    ingredientCategoryId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!restaurantId) {
      return console.warn("Missing restaurantId. Make sure you loaded getRestaurantByUserId()");
    }
    if (!formData.ingredientCategoryId) {
      return console.warn("Select ingredient category");
    }
    const payload = {
      name: formData.name.trim(),
      categoryId: Number(formData.ingredientCategoryId), // map đúng DTO
      restaurantId,
    };
    dispatch(createIngredient({ data: payload }));
    // optional reset
    // setFormData({ name: "", ingredientCategoryId: "" });
  };

  return (
    <div className="p-5">
      <h1 className="text-gray-400 text-center text-xl pb-10">Create Ingredient</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Ingredient Name"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.name}
          required
        />

        <FormControl fullWidth>
          <InputLabel id="ingredient-category-label">Ingredient Category</InputLabel>
          <Select
            labelId="ingredient-category-label"
            id="ingredient-category"
            value={formData.ingredientCategoryId}
            label="Ingredient Category"
            name="ingredientCategoryId"
            onChange={handleInputChange}
            required
          >
            {ingredientCategories.length > 0 ? (
              ingredientCategories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))
            ) : (
              // fallback placeholders, xóa khi đã có dữ liệu thật
              <>
                <MenuItem value={10}>example1</MenuItem>
                <MenuItem value={20}>example2</MenuItem>
                <MenuItem value={30}>example3</MenuItem>
              </>
            )}
          </Select>
        </FormControl>

        <Button fullWidth variant="contained" type="submit" color="primary" className="mt-5">
          Create
        </Button>
      </form>
    </div>
  );
};
