import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { Box, Button, Card, Divider, Grid, Modal, TextField } from "@mui/material";
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
   width: 400,
   bgcolor: 'background.paper',
   outlined: "none",
   boxShadow: 24,
   p: 4,
 };

const Cart = () => {

   const ceateOrderUsingSelectedAddress = () => {

   }

   const dispatch = useDispatch();

   const handleOpenAddressModal = () => setOpen(true)
   const [open, setOpen] = React.useState(false);

   const {cart, auth} = useSelector(store => store)

  const handleClose = () => setOpen(false);
  
  const handleSubmit = (values) => {
   const data = {
      jwt: localStorage.getItem('jwt'),
      order:{
         restaurantId: cart.cartItems[0].food?.restaurant.id,
         deliveryAddress: {
            fullName: auth.user?.fullName,
            streetAddress: values.streetAddress,
            state: values.state,
            pinCode: values.pinCode,
            city: values.city,
         }
      } 
   }

   dispatch(createOrder(data))
   console.log("form value",values);
}

   const initialValues = {
      streetAddress:"",
      state:"",
      pinCode: "",
      city:""
   }
   const validationSchema = Yup.object().shape({
      streetAddress: Yup.string().required("Street Address is required"),
      state: Yup.string().required("State is required"),
      pinCode: Yup.string().required("Pin Code is required"),
      city: Yup.string().required("City is required")
   })
  return (
    <div>
      <main className="lg:flex justify-between">
        <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
          {cart.cartItems.map((item) => 
            <CartItem item = {item}/>
          )}
         <Divider/>

         <div className="billDetails px-5 text-sm">
            <p className="font-extralight py-2">Bill details</p>
            <div className="space-y-3">
               <div className="flex justify-between text-gray-400">
                  <p>Item total</p>
                  <p>{cart.cart?.total/1000}.000VND</p>
               </div>

               <div className="flex justify-between text-gray-400">
                  <p>Delivery Fee</p>
                  <p>20.000VND</p>
               </div>

               <div className="flex justify-between text-gray-400">
                  <p>GST and Restaurant Charges</p>
                  <p>5.000VND</p>
               </div>

               <Divider/>
            </div>

            <div className="flex justify-between text-gray-400 pt-5">
               <p>Total Pay</p>
               <p>{(cart.cart?.total + 20000 + 5000)/1000}.000VND</p>
            </div>
         </div>
        </section>
        <Divider orientation="vertical" flexItem/>

        <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
         <div>
            <h1 className="text-center font-semibold text-2xl py-10">Choose Delivery Address</h1>

            <div className="flex gap-5 flex-wrap justify-center">
               {
                  [1,2,3].map((item)=>
                     <AddressCard 
                  handleSelectAddress={ceateOrderUsingSelectedAddress}
                  item={item} showButton={true}/>
                  )
               }
               <Card className="flex gap-5 w-64 p-5">
      <AddLocationAltIcon/>
      <div className='space-y-3 text-gray-500'>
         <h1 className='font-semibold text-lg text-white'>Add new address</h1>
         {
         <Button variant='outlined' fullWidth onClick={handleOpenAddressModal}>Add</Button>}
      </div>
    </Card>
            </div>
         </div>
        </section>
      </main>

      <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Formik initialValues = {initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} >
      <Form >
      <Grid container spacing={2}>
         <Grid item xs={12}>
            <Field as={TextField} 
            name = "streetAddress"
            label = "streetAddress"
            fullWidth 
            variant="outlined"
            // error = {!ErrorMessage("streetAddress")}
            // helperText = {
            //    <ErrorMessage>
            //       {(msg)=><span className="text-red-600">{msg}</span>}
            //    </ErrorMessage>
            // }
            />
         </Grid>

         <Grid item xs={12}>
            <Field as={TextField} 
            name = "state"
            label = "state"
            fullWidth 
            variant="outlined"
            // error = {!ErrorMessage("streetAddress")}
            // helperText = {
            //    <ErrorMessage>
            //       {(msg)=><span className="text-red-600">{msg}</span>}
            //    </ErrorMessage>
            // }
            />
         </Grid>  

         <Grid item xs={12}>
            <Field as={TextField} 
            name = "city"
            label = "city"
            fullWidth 
            variant="outlined"
            // error = {!ErrorMessage("streetAddress")}
            // helperText = {
            //    <ErrorMessage>
            //       {(msg)=><span className="text-red-600">{msg}</span>}
            //    </ErrorMessage>
            // }
            />
         </Grid>   

         <Grid item xs={12}>
            <Field as={TextField} 
            name = "pinCode"
            label = "pinCode"
            fullWidth 
            variant="outlined"
            // error = {!ErrorMessage("streetAddress")}
            // helperText = {
            //    <ErrorMessage>
            //       {(msg)=><span className="text-red-600">{msg}</span>}
            //    </ErrorMessage>
            // }
            />
         </Grid> 

         <Grid item xs={12}>
<Button variant="contained" type="submit" color="primary">Delivery here</Button>
         </Grid>
      </Grid>
      </Form>
      
    </Formik>
  </Box>
</Modal>
    </div>
  );
};

export default Cart;
