// component/admin-component/event/EventsGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Card, CardMedia, CardContent, CardActions, Typography,
  Grid, IconButton, Chip, CircularProgress, Tooltip, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getAllEvents, deleteEventAction } from "../../State/Restaurant/Action";

export const EventsGrid = ({ onlyMine = false, showDelete = true }) => {
  const dispatch = useDispatch();

  // ── lấy đúng từ restaurant slice
  const {
    events = [],        // global events list
    loading,            // shared loading của restaurant slice
    error,              // shared error
    usersRestaurant,    // để lọc onlyMine
  } = useSelector((s) => s.restaurant || {}, shallowEqual);

  const myRestaurantId = usersRestaurant?.id;

  useEffect(() => {
    // lấy public events; Action của bạn đã set meta isPublic nếu cần
    dispatch(getAllEvents());
  }, [dispatch]);

  const rows = useMemo(() => {
    if (!onlyMine || !myRestaurantId) return events;
    return events.filter((e) => String(e.restaurantId) === String(myRestaurantId));
  }, [events, onlyMine, myRestaurantId]);

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!showDelete) return;
    const ok = window.confirm("Delete this event?");
    if (!ok) return;
    try {
      setDeletingId(id);
      await dispatch(deleteEventAction({ eventId: id }));
      // Không cần refetch: reducer của bạn có thể tự filter ra.
      // Nếu reducer chưa làm, gọi lại:
      // await dispatch(getAllEvents());
    } finally {
      setDeletingId(null);
    }
  };

  const fmt = (t) => (t ? dayjs(t).format("DD/MM/YYYY HH:mm") : "—");
  const colorByStatus = (s) =>
    s === "ACTIVE" ? "success" : s === "CANCELED" ? "error" : "default";

  if (loading) {
    return (
      <Box p={3} display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size={22} />
        <Typography ml={2}>Loading events…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{String(error)}</Typography>
      </Box>
    );
  }

  if (!rows.length) {
    return (
      <Box p={3}>
        <Typography color="text.secondary">No events found.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2} p={2}>
      {rows.map((e) => (
        <Grid item xs={12} sm={6} md={4} key={e.id}>
          <Card>
            {/* BE: single image */}
            {e.image ? (
              <CardMedia component="img" height="160" image={e.image} alt={e.title} />
            ) : null}

            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6" noWrap title={e.title}>
                  {e.title}
                </Typography>
                <Chip size="small" label={e.status || "ACTIVE"} color={colorByStatus(e.status)} />
              </Box>

              <Typography variant="body2" color="text.secondary">
                {fmt(e.startAt)} → {fmt(e.endAt)}
              </Typography>

              {onlyMine && e.restaurantId && (
                <Typography variant="caption" color="text.secondary">
                  Restaurant #{e.restaurantId}
                </Typography>
              )}
            </CardContent>

            {onlyMine && showDelete && (
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Tooltip title="Delete event">
                  <span>
                    <IconButton
                      onClick={() => handleDelete(e.id)}
                      disabled={deletingId === e.id}
                      aria-label="delete-event"
                    >
                      {deletingId === e.id ? <CircularProgress size={18} /> : <DeleteIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
