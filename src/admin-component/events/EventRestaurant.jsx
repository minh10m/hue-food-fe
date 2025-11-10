import { Box, Button, Grid, Modal, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import React from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { createEvenAction, getAllEvents } from "../../State/Restaurant/Action";

const style = {
  position: "absolute", top: "50%", left: "50%",
  transform: "translate(-50%, -50%)", width: 400,
  bgcolor: "background.paper", border: "2px solid #000", boxShadow: 24, p: 4,
};

export const EventRestaurant = () => {
  const dispatch = useDispatch();
  const restaurantId = useSelector((s) => s.restaurant?.usersRestaurant?.id);

  const [formValues, setFormValues] = React.useState({
    image: "",
    name: "",
    // lưu dayjs object để DateTimePicker hoạt động, khi submit mới format ISO
    startedAt: null,
    endedAt: null,
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFormChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleDateChange = (date, key) => {
    setFormValues((prev) => ({ ...prev, [key]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantId) return console.warn("Missing restaurantId");
    if (!formValues.name || !formValues.startedAt || !formValues.endedAt)
      return console.warn("Please fill name, start & end time");

    const payload = {
      title: formValues.name.trim(),
      description: "",                          // tùy bạn có ô nhập mô tả thì map vào
      image: formValues.image?.trim() || null,  // single image
      startAt: dayjs(formValues.startedAt).format("YYYY-MM-DDTHH:mm:ss"),
      endAt: dayjs(formValues.endedAt).format("YYYY-MM-DDTHH:mm:ss"),
      // status: "ACTIVE" // nếu muốn set tay
    };

    try {
      await dispatch(createEvenAction({ data: payload, restaurantId }));
      await dispatch(getAllEvents());
      setFormValues({ image: "", name: "", startedAt: null, endedAt: null });
      handleClose();
    } catch (err) {
      console.error("create event failed", err);
    }
  };

  return (
    <div>
      <div className="p-5">
        <Button onClick={handleOpen} variant="contained">Create New Event</Button>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="image" label="Image URL" variant="outlined" fullWidth
                  value={formValues.image} onChange={handleFormChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="name" label="Event Name" variant="outlined" fullWidth required
                  value={formValues.name} onChange={handleFormChange}
                />
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Start Date and Time"
                    value={formValues.startedAt}
                    onChange={(v) => handleDateChange(v, "startedAt")}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="End Date and Time"
                    value={formValues.endedAt}
                    onChange={(v) => handleDateChange(v, "endedAt")}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>Create</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
