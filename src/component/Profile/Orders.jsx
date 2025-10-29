// Orders.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getUsersOrders } from "../../State/Order/Action";
import OrderCard from "./OrderCard";

const Orders = () => {
  const dispatch = useDispatch();

  // ✅ Select only the order slice fields you need
  const { orders, loading, error } = useSelector(
    (s) => ({
      orders: s.order?.orders ?? [],
      loading: s.order?.loading ?? false,
      error: s.order?.error ?? null,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getUsersOrders()); // interceptor adds Authorization
  }, [dispatch]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center pt-6">
        <h1 className="text-2xl text-center pb-6 font-semibold">my orders</h1>
        <p className="text-gray-400">Đang tải đơn hàng…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center pt-6">
        <h1 className="text-2xl text-center pb-6 font-semibold">my orders</h1>
        <p className="text-red-400">Lỗi: {String(error)}</p>
      </div>
    );
  }

  const flatItems = orders.flatMap((o) =>
    (o.items || []).map((it) => ({ order: o, item: it }))
  );

  if (flatItems.length === 0) {
    return (
      <div className="flex flex-col items-center pt-6">
        <h1 className="text-2xl text-center pb-6 font-semibold">my orders</h1>
        <p className="text-gray-400">Bạn chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-6">
      <h1 className="text-2xl text-center pb-6 font-semibold">my orders</h1>
      <div className="space-y-5 w-full lg:w-1/2">
        {flatItems.map(({ order, item }) => (
          <OrderCard key={`${order.id}-${item.id}`} order={order} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
