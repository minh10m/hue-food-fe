// OrderTable.jsx
import {
  Box, Card, CardHeader, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, Typography
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getRestaurantOrders } from "../../State/Restaurant Orders/Action";

export const OrderTable = () => {
  const dispatch = useDispatch();

  // lấy id nhà hàng của user
  const restaurantId = useSelector(
    (s) => s.restaurant?.usersRestaurant?.id
  );

  // bộ lọc trạng thái đơn
  const [orderStatus, setOrderStatus] = useState(""); // "" = tất cả

  // chọn dữ liệu từ store (điều chỉnh theo reducer của bạn)
  const { items, loading, error } = useSelector(
    (s) => ({
      items: s.order?.items || [],    // danh sách orders
      loading: s.order?.loading,      // boolean
      error: s.order?.error,          // string | object
    }),
    shallowEqual
  );

  const lastKeyRef = useRef(null);
  const keyNow = `${restaurantId || "none"}|${orderStatus || "ALL"}`;

  useEffect(() => {
    if (!restaurantId) return;
    if (lastKeyRef.current === keyNow) return;         // tránh gọi lại cùng input
    lastKeyRef.current = keyNow;

    dispatch(getRestaurantOrders({ restaurantId, orderStatus: orderStatus || undefined }));
  }, [dispatch, restaurantId, orderStatus]);

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title="All Orders"
          sx={{ pt: 2, alignItems: "center" }}
          action={
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={orderStatus}
                label="Status"
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="ACCEPTED">Accepted</MenuItem>
                <MenuItem value="PREPARING">Preparing</MenuItem>
                <MenuItem value="READY">Ready</MenuItem>
                <MenuItem value="ON_THE_WAY">On the way</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          }
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Image</TableCell>
                <TableCell align="right">Customer</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Ingredients</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body2">Loading...</Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading && error && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography color="error" variant="body2">
                      {typeof error === "string" ? error : "Đã có lỗi xảy ra"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography variant="body2">No Order Found</Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && items.map((o) => (
                <TableRow key={o.id}>
                  <TableCell component="th" scope="row">
                    {o.id}
                  </TableCell>
                  <TableCell align="right">
                    {/* điều chỉnh field ảnh theo BE, vd o.imageUrl hoặc o.items[0].food.image */}
                    <img
                      src={o.imageUrl || o.thumbnail || "/placeholder.png"}
                      alt={o.name || "order"}
                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                      onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                    />
                  </TableCell>
                  <TableCell align="right">{o.customerName || o.customer?.fullName || "-"}</TableCell>
                  <TableCell align="right">
                    {o.totalPrice != null ? `${o.totalPrice.toLocaleString("vi-VN")}₫` : "-"}
                  </TableCell>
                  <TableCell align="right">{o.name || o.title || (o.items?.[0]?.food?.name ?? "-")}</TableCell>
                  <TableCell align="right">
                    {Array.isArray(o.ingredients)
                      ? o.ingredients.join(", ")
                      : o.items?.[0]?.food?.ingredients?.map((i) => i.name).join(", ") || "-"}
                  </TableCell>
                  <TableCell align="right">{o.status || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};
