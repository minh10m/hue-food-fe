import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { Box, Button, Card, Divider, Grid, Modal, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { createOrder } from '../../State/Order/Action';
import AddressCard from "./AddressCard";
import CartItem from "./CartItem";

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  maxWidth: '92vw',
  bgcolor: 'background.paper',
  outline: 'none',
  borderRadius: 12,
  boxShadow: 24,
  p: 3.5,
};

const Cart = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const handleOpenAddressModal = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { cart } = useSelector((store) => store);

  // Lấy items/tổng tiền an toàn
  const items = cart?.cart?.items || [];
  const cartTotal = Number(cart?.cart?.total || 0);
  const deliveryFee = 20000;
  const surcharges = 5000;
  const grandTotal = cartTotal + deliveryFee + surcharges;

  // Tạo đơn khi chọn một địa chỉ có sẵn (demo)
  const createOrderUsingSelectedAddress = (addr) => {
    if (!items.length) return;
    const restaurantId = items[0]?.food?.restaurant?.id;
    if (!restaurantId) return;

    const payload = {
      order: {
        restaurantId,
        deliveryAddress: {
          phone: addr?.phone,
          street: addr?.street,
          city: addr?.city,
          isDefault: !!addr?.isDefault,
        },
      },
    };

    dispatch(createOrder(payload));
  };

  // Submit địa chỉ mới từ modal
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!items.length) return;
      const restaurantId = items[0]?.food?.restaurant?.id;
      if (!restaurantId) return;

      const payload = {
        order: {
          restaurantId,
          deliveryAddress: {
            phone: values.phone,
            street: values.street,
            city: values.city,
            isDefault: values.isDefault || false,
          },
        },
      };

      await dispatch(createOrder(payload));
      resetForm();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    phone: "",
    street: "",
    city: "",
    isDefault: false,
  };

  const validationSchema = Yup.object().shape({
    phone: Yup.string().max(20, "Tối đa 20 ký tự").required("Số điện thoại là bắt buộc"),
    street: Yup.string().max(150, "Tối đa 150 ký tự").required("Địa chỉ là bắt buộc"),
    city: Yup.string().max(100, "Tối đa 100 ký tự").required("Thành phố là bắt buộc"),
    isDefault: Yup.boolean(),
  });

  return (
    <div className='pt-16 md:pt-20'>
      <main className="lg:flex justify-between">
        {/* Left: Cart items + bill */}
        <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <div className="billDetails px-5 text-sm">
            <p className="font-extralight py-2">Bill details</p>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-400">
                <p>Item total</p>
                <p>{(cartTotal / 1000).toLocaleString()}.000VND</p>
              </div>

              <div className="flex justify-between text-gray-400">
                <p>Delivery Fee</p>
                <p>{(deliveryFee / 1000).toLocaleString()}.000VND</p>
              </div>

              <div className="flex justify-between text-gray-400">
                <p>GST and Restaurant Charges</p>
                <p>{(surcharges / 1000).toLocaleString()}.000VND</p>
              </div>

              <Divider />
            </div>

            <div className="flex justify-between text-gray-400 pt-5">
              <p>Total Pay</p>
              <p>{(grandTotal / 1000).toLocaleString()}.000VND</p>
            </div>
          </div>
        </section>

        <Divider orientation="vertical" flexItem />

        {/* Right: Address list + add new */}
        <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
          <div>
            <h1 className="text-center font-semibold text-2xl py-10">Choose Delivery Address</h1>

            <div className="flex gap-5 flex-wrap justify-center">
              {/* Demo 3 địa chỉ sẵn – thay bằng danh sách address thực từ user nếu có */}
              {[1, 2].map((i) => (
                <AddressCard
                  key={i}
                  item={{
                    phone: "0901234567",
                    street: "11 Nguyễn Huy Lượng, Phường Phú Hậu",
                    city: "Thành phố Huế",
                    isDefault: i === 1,
                  }}
                  showButton={true}
                  handleSelectAddress={createOrderUsingSelectedAddress}
                />
              ))}

              <Card className="flex gap-5 w-64 p-5">
                <AddLocationAltIcon />
                <div className='space-y-3 text-gray-500'>
                  <h1 className='font-semibold text-lg text-white'>Add new address</h1>
                  <Button
                    variant='outlined'
                    fullWidth
                    onClick={handleOpenAddressModal}
                    disabled={!items.length}
                  >
                    Add
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Modal thêm địa chỉ mới */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="phone"
                      label="Số điện thoại"
                      fullWidth
                      variant="outlined"
                      error={touched.phone && !!errors.phone}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="street"
                      label="Địa chỉ (số nhà, đường)"
                      fullWidth
                      variant="outlined"
                      error={touched.street && !!errors.street}
                      helperText={touched.street && errors.street}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="city"
                      label="Thành phố"
                      fullWidth
                      variant="outlined"
                      error={touched.city && !!errors.city}
                      helperText={touched.city && errors.city}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Field as={Checkbox} name="isDefault" color="primary" />}
                      label="Đặt làm địa chỉ mặc định"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      fullWidth
                      disabled={isSubmitting || !items.length}
                    >
                      Delivery here
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default Cart;
