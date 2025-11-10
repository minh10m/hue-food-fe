// component/admin-component/food/FoodCategoryTable.jsx
import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CreateFoodCategory } from "./CreateFoodCategory";
import { getRestaurantsCategory } from "../../State/Restaurant/Action";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: 8,
  boxShadow: 24,
  p: 3,
};

export const FoodCategoryTable = () => {
  const dispatch = useDispatch();
  const restaurantId = useSelector((s) => s.restaurant?.usersRestaurant?.id);

  const { categories, loading, error } = useSelector(
    (s) => ({
      categories: s.restaurant?.categories || [],
      loading: s.restaurant?.loading,
      error: s.restaurant?.error,
    }),
    shallowEqual
  );

  const rows = useMemo(() => categories, [categories]);

  const lastFetchedIdRef = useRef(null);
  useEffect(() => {
    if (!restaurantId) return;
    if (lastFetchedIdRef.current === restaurantId) return;
    lastFetchedIdRef.current = restaurantId;
    dispatch(getRestaurantsCategory({ restaurantId }));
  }, [dispatch, restaurantId]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // tạo xong -> refresh + đóng modal
  const handleCreated = () => {
    if (restaurantId) dispatch(getRestaurantsCategory({ restaurantId }));
    handleClose();
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          action={
            <IconButton onClick={handleOpen} aria-label="create-food-category">
              <CreateIcon />
            </IconButton>
          }
          title="Food Category"
          sx={{ pt: 2, alignItems: "center" }}
        />

        <TableContainer component={Paper}>
          {loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" p={4}>
              <CircularProgress size={24} />
              <Typography ml={2}>Loading categories…</Typography>
            </Box>
          ) : error ? (
            <Box p={3}>
              <Typography color="error">
                {typeof error === "string" ? error : "Đã có lỗi xảy ra"}
              </Typography>
            </Box>
          ) : (
            <Table aria-label="food-category-table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Id</TableCell>
                  <TableCell align="left">Title</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No Category Found
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell align="left">{c.id}</TableCell>
                      <TableCell align="left">{c.name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>

      <Modal open={open} onClose={handleClose} keepMounted>
        <Box sx={style}>
          {/* truyền onSuccess để refresh + đóng modal */}
          <CreateFoodCategory onSuccess={handleCreated} />
        </Box>
      </Modal>
    </Box>
  );
};
