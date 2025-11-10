// component/admin-component/menu/CreateMenuForm.jsx
import {
  Button, CircularProgress, Grid, IconButton, Box, Chip,
  FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField,
} from "@mui/material";
import { useFormik } from "formik";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { uploadImageToCloudinary } from "../util/UploadToCloudinary";
import { getRestaurantsCategory } from "../../State/Restaurant/Action";
import { getIngredientsOfRestaurant } from "../../State/ingredients/Action";
import { createMenuItem } from "../../State/Menu/Action";
import { useNavigate } from "react-router-dom";

export const CreateMenuForm = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [uploadImage, setUploadImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const restaurantId = useSelector((s) => s.restaurant?.usersRestaurant?.id);
  const { categories = [] } = useSelector(
    (s) => ({ categories: s.restaurant?.categories || [] }),
    shallowEqual
  );
  const { ingredients = [] } = useSelector(
    (s) => s.ingredients || {},
    shallowEqual
  );

  useEffect(() => {
    if (!restaurantId) return;
    if (!categories.length) dispatch(getRestaurantsCategory({ restaurantId }));
    if (!ingredients.length) dispatch(getIngredientsOfRestaurant({ id: restaurantId }));
  }, [dispatch, restaurantId]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
      ingredientIds: [],
      vegetarian: true,
      seasonal: false,
      images: [],
    },
    onSubmit: async (values, helpers) => {
      if (!restaurantId) return;
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || "",
        price: values.price === "" ? 0 : Number(values.price),
        restaurantId,
        vegetarian: Boolean(values.vegetarian),
        seasonal: Boolean(values.seasonal),
        images: values.images,
        category: { id: Number(values.categoryId) }, // BE expects object
        ingredients: values.ingredientIds.map((id) => ({ id: Number(id) })), // BE expects objects
      };

      try {
        setSubmitting(true);
        await dispatch(createMenuItem(payload));
        helpers.resetForm();
        onSuccess?.();
        navigate("/admin/restaurants/menu");
      } catch (e) {
        // optional: show toast
        console.error("createMenuItem failed:", e);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      formik.setFieldValue("images", [...formik.values.images, url]);
    } finally {
      setUploadImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    const next = [...formik.values.images];
    next.splice(index, 1);
    formik.setFieldValue("images", next);
  };

  const handleCancel = () => {
    formik.resetForm();     // reset form
    onCancel?.(); 
    navigate("/admin/restaurants/menu");         // ⬅️ đóng modal ở parent
  };

  return (
    <div className="py-6 px-4">
      <h1 className="font-bold text-2xl text-center pb-2">Add New Menu</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Grid container spacing={2}>
          {/* Images */}
          <Grid className="flex flex-wrap gap-5" item xs={12}>
            <input accept="image/*" id="fileInput" style={{ display: "none" }} onChange={handleImageChange} type="file" />
            <label className="relative" htmlFor="fileInput">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600">
                <AddPhotoAlternateIcon />
              </span>
              {(uploadImage) && (
                <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                  <CircularProgress size={20}/>
                </div>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              {formik.values.images.map((image, index) => (
                <div className="relative" key={index}>
                  <img className="w-24 h-24 object-cover rounded-md" src={image} alt={`Uploaded ${index + 1}`} />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{ position: "absolute", top: 0, right: 0, outline: "none", backgroundColor: "gray" }}
                  >
                    <CloseIcon sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>

          {/* Basic fields */}
          <Grid item xs={12}>
            <TextField fullWidth id="name" name="name" label="Name" variant="outlined"
              onChange={formik.handleChange} value={formik.values.name} required disabled={submitting}/>
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth id="description" name="description" label="Description" variant="outlined"
              onChange={formik.handleChange} value={formik.values.description} disabled={submitting}/>
          </Grid>

          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth id="price" name="price" label="Price" type="number" inputProps={{ min: 0 }}
              variant="outlined" onChange={formik.handleChange} value={formik.values.price} disabled={submitting}
            />
          </Grid>

          {/* Food Category */}
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth disabled={submitting}>
              <InputLabel id="food-category-label">Food Category</InputLabel>
              <Select
                labelId="food-category-label"
                id="food-category"
                value={formik.values.categoryId}
                label="Food Category"
                name="categoryId"
                onChange={formik.handleChange}
                required
              >
                {categories.length > 0 ? (
                  categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)
                ) : (
                  <MenuItem value="" disabled>No category found</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Ingredients (multiple) */}
          <Grid item xs={12}>
            <FormControl fullWidth disabled={submitting}>
              <InputLabel id="ingredients-label">Ingredients</InputLabel>
              <Select
                labelId="ingredients-label"
                id="ingredients"
                name="ingredientIds"
                multiple
                value={formik.values.ingredientIds}
                onChange={formik.handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Ingredients" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => {
                      const found = ingredients.find((i) => String(i.id) === String(id));
                      return <Chip key={id} label={found?.name ?? id} />;
                    })}
                  </Box>
                )}
                MenuProps={{ PaperProps: { style: { maxHeight: 48 * 4.5 + 8, width: 280 } } }}
              >
                {ingredients.length > 0 ? (
                  ingredients.map((i) => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)
                ) : (
                  <MenuItem value="" disabled>No ingredients found</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          {/* Flags */}
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth disabled={submitting}>
              <InputLabel id="vegetarian-label">Is Vegetarian</InputLabel>
              <Select
                labelId="vegetarian-label" id="vegetarian"
                value={formik.values.vegetarian} label="Is Vegetarian" name="vegetarian"
                onChange={formik.handleChange}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} lg={6}>
            <FormControl fullWidth disabled={submitting}>
              <InputLabel id="seasonal-label">Is Seasonal</InputLabel>
              <Select
                labelId="seasonal-label" id="seasonal"
                value={formik.values.seasonal} label="Is Seasonal" name="seasonal"
                onChange={formik.handleChange}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} display="flex" gap={1} justifyContent="flex-end">
            <Button variant="outlined" type="button" onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" color="primary" disabled={submitting}>
              {submitting ? <><CircularProgress size={18} sx={{ mr: 1 }} />Creating…</> : "Create Menu"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};
