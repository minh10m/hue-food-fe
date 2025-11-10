import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { uploadImageToCloudinary } from "../util/UploadToCloudinary";
import { createRestaurant } from "../../State/Restaurant/Action";
import { useNavigate } from "react-router-dom";

export const CreateRestaurantForm = () => {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
const { restaurant } = useSelector((s) => s.restaurant);

  useEffect(() => {
    if (restaurant) {
      navigate("/admin/restaurants");
    }
  }, [restaurant, navigate])

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      cuisineType: "",
      address: {
        street: "",
        city: "",
      },
      contactInformation: {
        email: "",
        mobile: "",
        twitter: "",
        instagram: "",
      },
      openingHours: "Mon-Sun : 9:00 AM - 12:00 PM",
      // single image url
      image: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          name: values.name,
          description: values.description,
          cuisineType: values.cuisineType,
          address: {
            street: values.address.street,
            city: values.address.city,
          },
          contactInformation: {
            email: values.contactInformation.email,
            mobile: values.contactInformation.mobile,
            twitter: values.contactInformation.twitter,
            instagram: values.contactInformation.instagram,
          },
          openingHours: values.openingHours,
          image: values.image || "", // single string
        };
        console.log("payload", payload);
        await dispatch(createRestaurant({data: payload}));

      } catch (err) {
        console.error("Create restaurant failed", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // upload one file -> set formik image field to URL
  const handleImageChange = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      // set single image URL
      formik.setFieldValue("image", uploadedUrl);
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    formik.setFieldValue("image", "");
  };

  return (
    <div className="py-10 px-5 lg:flex items-center justify-center min-h-screen">
      <div className="lg: max-w-4xl w-full">
        <h1 className="font-bold text-2xl text-center py-2">Add New Restaurant</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
            {/* Image upload / preview */}
            <Grid item xs={12} className="flex items-center gap-4">
              <input
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageChange}
                type="file"
              />

              {/* If no image -> show upload placeholder */}
              {!formik.values.image && (
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="w-28 h-28 flex items-center justify-center border rounded-md border-gray-400">
                    <AddPhotoAlternateIcon />
                  </div>
                </label>
              )}

              {/* If image exists -> show preview + remove */}
              {formik.values.image && (
                <div className="relative">
                  <img
                    src={formik.values.image}
                    alt="preview"
                    className="w-28 h-28 object-cover rounded-md border"
                    style={{ display: "block" }}
                  />
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              )}

              {/* show uploading spinner overlay when uploading */}
              {uploading && (
                <div className="w-28 h-28 flex items-center justify-center">
                  <CircularProgress size={24} />
                </div>
              )}

              {/* optionally show small hint / reset */}
              <div className="text-sm text-gray-600">
                <div>Allowed: jpg, png. Max: (depends on your upload).</div>
                {formik.values.image ? (
                  <div className="mt-1 text-xs text-gray-500">You can replace the image by uploading another file.</div>
                ) : (
                  <div className="mt-1 text-xs text-gray-500">Click the icon to upload a single image</div>
                )}
              </div>
            </Grid>

            {/* Basic fields */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="cuisineType"
                name="cuisineType"
                label="Cuisine Type"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.cuisineType}
              />
            </Grid>

            {/* Address fields — using dot notation to map nested object */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address.street"
                name="address.street"
                label="Street Address"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.address.street}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address.city"
                name="address.city"
                label="City"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.address.city}
              />
            </Grid>

            {/* Contact fields */}
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id="contactInformation.email"
                name="contactInformation.email"
                label="Email"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.contactInformation.email}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id="contactInformation.mobile"
                name="contactInformation.mobile"
                label="Mobile"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.contactInformation.mobile}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id="contactInformation.twitter"
                name="contactInformation.twitter"
                label="Twitter"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.contactInformation.twitter}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                id="contactInformation.instagram"
                name="contactInformation.instagram"
                label="Instagram"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.contactInformation.instagram}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="openingHours"
                name="openingHours"
                label="Opening Hours"
                variant="outlined"
                onChange={formik.handleChange}
                value={formik.values.openingHours}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Creating..." : "Create Restaurant"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};
