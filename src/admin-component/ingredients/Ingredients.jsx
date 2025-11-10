import React from "react";
import { IngredientsTable } from "./IngredientsTable";
import { Grid } from "@mui/material";
import { IngredientsCategoryTable } from "./IngredientsCategoryTable";

export const Ingredients = () => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <IngredientsTable />
        </Grid>

        <Grid item xs={12} lg={4}>
          <IngredientsCategoryTable />
        </Grid>
      </Grid>
    </div>
  );
};
