import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategoryAction } from "../../State/Restaurant/Action";

export const CreateFoodCategory = () => {
  const {usersRestaurant} = useSelector((store) => store.restaurant)
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    restaurantId: usersRestaurant?.id,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!formData.name?.trim()) {
      setError("Category name is required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      restaurantId: usersRestaurant?.id,
    };

    if (!payload.restaurantId) {
      setError("No restaurant selected or available in store");
      return;
    }

    try {
      setLoading(true);
      dispatch(createCategoryAction(payload)); // action trả về promise nếu bạn muốn
      // reset form on success
      setFormData({ name: "", restaurantId: "" });
    } catch (err) {
      // action creator sẽ dispatch failure; có thể show msg ở đây nếu action re-throws
      console.error("Create category failed", err);
      setError(err?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5">
        <h1 className="text-gray-400 text-center text-xl pb-10">
          Create Category
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Food Category"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
          />

          {error && <div className="text-sm text-red-600">{error}</div>}

        <Button
          variant="contained"
          type="submit"
          color="primary"
          className="mt-5"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </Button>
        </form>
      </div>
    </div>
  );
};
