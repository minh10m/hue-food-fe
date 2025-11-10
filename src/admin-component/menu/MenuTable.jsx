// component/admin-component/menu/MenuTable.jsx
import {
  Box, Card, CardHeader, IconButton, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress, Typography, Avatar
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getMenuItemsByRestaurantId, deleteFoodAction } from "../../State/Menu/Action";

export const MenuTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const restaurantId = useSelector((s) => s.restaurant?.usersRestaurant?.id);
  const { menuItems = [], loading, error, deletingId } = useSelector(
    (s) => s.menu || {},
    shallowEqual
  );

  console.log(menuItems);


  useEffect(() => {
    if (!restaurantId) return;
    dispatch(getMenuItemsByRestaurantId({ restaurantId }));
  }, [dispatch, restaurantId]);

  const rows = useMemo(() => menuItems, [menuItems]);

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this menu item?");
    if (!ok) return;
    try {
      await dispatch(deleteFoodAction({ foodId: id }));
    } catch (e) {
      // optional: toast lỗi
      console.error(e);
    }
  };

  const firstImage = (arr) => (Array.isArray(arr) && arr.length ? arr[0] : null);
  const formatPrice = (p) => (typeof p === "number" ? p.toLocaleString("vi-VN") + "₫" : (p ?? "-"));

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          action={
            <IconButton onClick={() => navigate("/admin/restaurants/add-menu")} aria-label="create-menu">
              <CreateIcon />
            </IconButton>
          }
          title="Menu"
          sx={{ pt: 2, alignItems: "center" }}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" p={4}>
              <CircularProgress size={24} />
              <Typography ml={2}>Loading menu…</Typography>
            </Box>
          ) : error ? (
            <Box p={3}><Typography color="error">{String(error)}</Typography></Box>
          ) : (
            <Table sx={{ minWidth: 650 }} aria-label="menu-table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Image</TableCell>
                  <TableCell align="left">Title</TableCell>
                  <TableCell align="left">Category</TableCell>
                  <TableCell align="left">Ingredients</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No menu items. Click the ✎ button to add one.
                    </TableCell>
                  </TableRow>
                ) : rows.map((row) => {
                  const img = firstImage(row.images);
                  const ingNames = Array.isArray(row.ingredients)
                    ? row.ingredients.map((i) => i?.name).filter(Boolean).join(", ")
                    : "-";
                  const isDeleting = deletingId === row.id;
                  return (
                    <TableRow key={row.id}>
                      <TableCell align="left">
                        {img ? <Avatar variant="rounded" src={img} alt={row.name} /> : "-"}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.foodCategory?.name ?? "-"}</TableCell>
                      <TableCell align="left">{ingNames || "-"}</TableCell>
                      <TableCell align="right">{formatPrice(row.price)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="delete-menu-item"
                          onClick={() => onDelete(row.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? <CircularProgress size={18} /> : <Delete />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>
    </Box>
  );
};
