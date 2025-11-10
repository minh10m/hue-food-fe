import {
  Box, Card, CardHeader, IconButton, Modal, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Typography
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { useDispatch, useSelector } from "react-redux";
import { CreateIngredientsForm } from "./CreateIngredientsForm";
import { getIngredientsOfRestaurant } from "../../State/ingredients/Action";
import { use } from "react";

const style = {
  position: "absolute", top: "50%", left: "50%",
  transform: "translate(-50%, -50%)", width: 420,
  bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 3,
};

export const IngredientsTable = () => {
  const dispatch = useDispatch();

  const restaurantId = useSelector((s) => s.restaurant?.usersRestaurant?.id);
  const s = useSelector((s) => s);
  console.log(s);

  const { ingredients = [], loading, error } = useSelector((s) => s.ingredients || {});
  const rows = useMemo(() => ingredients, [ingredients]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (restaurantId) dispatch(getIngredientsOfRestaurant({ id: restaurantId }));
  }, [dispatch, restaurantId]);

  const handleCreated = () => {
    if (restaurantId) dispatch(getIngredientsOfRestaurant({ id: restaurantId }));
    handleClose();
  };

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          action={
            <IconButton onClick={handleOpen} aria-label="create-ingredient">
              <CreateIcon />
            </IconButton>
          }
          title="Ingredients"
          sx={{ pt: 2, alignItems: "center" }}
        />

        <TableContainer component={Paper}>
          {loading ? (
            <Box display="flex" alignItems="center" justifyContent="center" p={4}>
              <CircularProgress size={24} />
              <Typography ml={2}>Loading ingredients…</Typography>
            </Box>
          ) : error ? (
            <Box p={3}><Typography color="error">Error: {String(error)}</Typography></Box>
          ) : (
            <Table aria-label="ingredients-table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Id</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Category</TableCell>
                  <TableCell align="left">Available</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center">No ingredients yet. Click ✎ to create one.</TableCell></TableRow>
                ) : rows.map((row) => (
                  <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.category?.name ?? row.categoryName ?? "-"}</TableCell>
                    <TableCell align="left">{(row.inStoke?.toString?.()? "Yes": "No") ?? "Data: Not Found"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>

      <Modal open={open} onClose={handleClose} keepMounted>
        <Box sx={style}>
          <CreateIngredientsForm onSuccess={handleCreated} />
        </Box>
      </Modal>
    </Box>
  );
};
