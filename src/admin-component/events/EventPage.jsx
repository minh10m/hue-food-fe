// component/admin-component/event/EventPage.jsx
import React, { useState } from "react";
import { Box, Button, Switch, FormControlLabel } from "@mui/material";
import { EventRestaurant } from "./EventRestaurant";
import { EventsGrid } from "./EventsGrid";

export const EventPage = () => {
  const [onlyMine, setOnlyMine] = useState(true);

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        <EventRestaurant />
        <FormControlLabel
          control={<Switch checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} />}
          label="Only my restaurant"
        />
      </Box>
      <EventsGrid onlyMine={onlyMine} />
    </Box>
  );
};
