import React, { useEffect } from "react";
import {
  Box, Grid, Card, CardContent, CardHeader, Typography, Button, Chip, Divider, Avatar,
} from "@mui/material";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { getAllEvents } from "../../State/Restaurant/Action";

/// import { getDashboardMetrics, getRecentOrders, getLowStock, getTopDishes } from "../../State/metrics/Action";

const KpiCard = ({ title, value, suffix, sub }) => (
  <Card>
    <CardContent>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" sx={{ mt: 0.5 }}>{value}{suffix ? <Typography component="span" variant="h6">{suffix}</Typography> : null}</Typography>
      {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
    </CardContent>
  </Card>
);

const Section = ({ title, action, children }) => (
  <Card>
    <CardHeader title={title} action={action} />
    <Divider />
    <CardContent>{children}</CardContent>
  </Card>
);

export const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const restaurantId = useSelector((s) => s.restaurant?.usersRestaurant?.id);

  // ====== SELECTORS (thay bằng state thật của bạn) ======
  const loading = useSelector((s) => s.metrics?.loading) || false;

  const metrics = useSelector((s) => s.metrics?.data || {
    revenueToday: 0,
    ordersToday: 0,
    avgOrderValue: 0,
    inProgressCount: 0,
    revenueByDay: [
      { day: "T2", revenue: 0 },
      { day: "T3", revenue: 0 },
      { day: "T4", revenue: 0 },
      { day: "T5", revenue: 0 },
      { day: "T6", revenue: 0 },
      { day: "T7", revenue: 0 },
      { day: "CN", revenue: 0 },
    ],
    ordersByHour: [
      { hour: "8h", count: 0 }, { hour: "10h", count: 0 }, { hour: "12h", count: 0 },
      { hour: "14h", count: 0 }, { hour: "16h", count: 0 }, { hour: "18h", count: 0 },
    ],
  });

  const recentOrders = useSelector((s) => s.order?.recent || []).slice(0, 7);
  const lowStock = useSelector((s) => s.ingredients?.lowStock || []);
  const topDishes = useSelector((s) => s.menu?.topSelling || []);
  const events = useSelector((s) => s.restaurant?.events || []);

  // ====== LOAD DATA ======
  useEffect(() => {
    if (!restaurantId) return;
    // TODO: gọi thunks thật ở đây
    // dispatch(getDashboardMetrics({ restaurantId, range: "7d" }));
    // dispatch(getRecentOrders({ restaurantId, limit: 7 }));
    // dispatch(getLowStock({ restaurantId, threshold: 10 }));
    // dispatch(getTopDishes({ restaurantId, range: "7d", limit: 5 }));
    dispatch(getAllEvents());
  }, [dispatch, restaurantId]);

  // ====== RENDER ======
  return (
    <Box p={2}>
      {/* KPIs */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><KpiCard title="Revenue today" value={metrics.revenueToday.toLocaleString("vi-VN")} suffix="₫" sub="Tổng doanh thu trong ngày" /></Grid>
        <Grid item xs={12} md={3}><KpiCard title="Orders today" value={metrics.ordersToday} sub="Số đơn trong ngày" /></Grid>
        <Grid item xs={12} md={3}><KpiCard title="Avg. order value" value={metrics.avgOrderValue.toLocaleString("vi-VN")} suffix="₫" sub="Giá trị TB/đơn hôm nay" /></Grid>
        <Grid item xs={12} md={3}><KpiCard title="In-progress" value={metrics.inProgressCount} sub="Đang chuẩn bị/giao" /></Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Section title="Weekly revenue">
            <Box height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.revenueByDay}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Section>
        </Grid>
        <Grid item xs={12} md={5}>
          <Section title="Orders by hour (today)">
            <Box height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.ordersByHour}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Section>
        </Grid>
      </Grid>

      {/* Lists */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Section
            title="Recent orders"
            action={<Button size="small" onClick={() => navigate("/admin/orders")}>View all</Button>}
          >
            {recentOrders.length === 0 ? (
              <Typography color="text.secondary">No recent orders.</Typography>
            ) : recentOrders.map((o) => (
              <Box key={o.id} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                <Box display="flex" gap={1} alignItems="center">
                  <Avatar sx={{ width: 28, height: 28 }}>{String(o.id).slice(-2)}</Avatar>
                  <Box>
                    <Typography variant="body2">Order #{o.id}</Typography>
                    <Typography variant="caption" color="text.secondary">{o.customerName || o.user?.fullName || "Guest"}</Typography>
                  </Box>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2">{(o.total || 0).toLocaleString("vi-VN")}₫</Typography>
                  <Chip size="small" label={o.status} />
                </Box>
              </Box>
            ))}
          </Section>
        </Grid>

        <Grid item xs={12} md={6}>
          <Section
            title="Low-stock ingredients"
            action={<Button size="small" onClick={() => navigate("/admin/ingredients")}>Manage</Button>}
          >
            {lowStock.length === 0 ? (
              <Typography color="text.secondary">All good. No low-stock items.</Typography>
            ) : lowStock.map((i) => (
              <Box key={i.id} display="flex" justifyContent="space-between" py={0.75}>
                <Typography variant="body2">{i.name}</Typography>
                <Typography variant="body2" color="error">{i.quantity}{i.unit ? ` ${i.unit}` : ""}</Typography>
              </Box>
            ))}
          </Section>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Section
            title="Top dishes (7d)"
            action={<Button size="small" onClick={() => navigate("/admin/restaurants/menu")}>View menu</Button>}
          >
            {topDishes.length === 0 ? (
              <Typography color="text.secondary">No data.</Typography>
            ) : topDishes.map((f) => (
              <Box key={f.id} display="flex" justifyContent="space-between" alignItems="center" py={0.75}>
                <Typography variant="body2">{f.name}</Typography>
                <Typography variant="body2">{f.sold || f.count} sold</Typography>
              </Box>
            ))}
          </Section>
        </Grid>

        <Grid item xs={12} md={6}>
          <Section
            title="Upcoming events"
            action={<Button size="small" onClick={() => navigate("/admin/events")}>Manage</Button>}
          >
            {events
              .filter((e) => e.restaurantId === restaurantId)
              .slice(0, 3)
              .map((e) => (
                <Box key={e.id} display="flex" justifyContent="space-between" alignItems="center" py={0.75}>
                  <Typography variant="body2">{e.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(e.startAt).toLocaleString("vi-VN")}
                  </Typography>
                </Box>
              ))}
            {events.filter((e) => e.restaurantId === restaurantId).length === 0 && (
              <Typography color="text.secondary">No upcoming events.</Typography>
            )}
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
};
