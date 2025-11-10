// component/admin-component/ingredients/IngredientsCategoryTable.jsx
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
import React, { useEffect, useMemo, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { useDispatch, useSelector } from "react-redux";
import { CreateIngredientsCategoryForm } from "./CreateIngredientsCategoryForm";
import { getIngredientCategory } from "../../State/ingredients/Action";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export const IngredientsCategoryTable = () => {
  const dispatch = useDispatch();
  const restaurantId = useSelector((s) => s.restaurant?.usersRestaurant?.id);
  const {
    category = [],
    loading,
    error,
  } = useSelector((s) => s.ingredients || {});

  const rows = useMemo(() => category, [category]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (restaurantId) dispatch(getIngredientCategory({ id: restaurantId }));
  }, [dispatch, restaurantId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCreated = () => {
    if (restaurantId) dispatch(getIngredientCategory({ id: restaurantId }));
    handleClose();
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          action={
            <IconButton onClick={handleOpen} aria-label="create-category">
              <CreateIcon />
            </IconButton>
          }
          title="Ingredients Category"
          sx={{ pt: 2, alignItems: "center" }}
        />

        <TableContainer component={Paper}>
          {loading ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
            >
              <CircularProgress size={24} />
              <Typography ml={2}>Loading categories…</Typography>
            </Box>
          ) : error ? (
            <Box p={3}>
              <Typography color="error">Error: {String(error)}</Typography>
            </Box>
          ) : (
            <Table aria-label="ingredient-category-table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Id</TableCell>
                  <TableCell align="left">Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <CreateIngredientsCategoryForm onSuccess={handleCreated} />
        </Box>
      </Modal>
    </Box>
  );
};
