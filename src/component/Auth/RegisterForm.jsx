import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../State/Authentication/Action'

const initialValues = {
  fullName:"",
  email:"",
  password:"",
  role:""
}


const RegisterForm = () => {

  const navigate = useNavigate()

  const dispatch = useDispatch();
  const handleSubmit = (values) => {
    dispatch(registerUser({userData: values, navigate}))
    console.log("form value,", values)
  }

  return (
    <div>
    <Typography className='text-center' variant='h5'>
      Register
    </Typography>

    <Formik onSubmit={handleSubmit} initialValues={initialValues}>
      <Form>
      <Field as={TextField} 
          name = "fullName"
          label = "fullName"  
          fullWidth 
          variant="outlined"
          margin="normal"
      />

      <Field as={TextField} 
          name = "email"
          label = "email"
          fullWidth 
          variant="outlined"
          margin="normal"
      />
      <Field as={TextField} 
          name = "password"
          label = "password"
          fullWidth 
          variant="outlined"
          margin="normal"
          type="password"
      />
      
      <FormControl fullWidth margin="normal">
  <InputLabel id="role-simple-select-label">Role</InputLabel>
  <Field
    as={Select}
    labelId="role-simple-select-label"
    id="role-simple-select"
    name='role'
    // value={age}
    label="role"
    // onChange={handleChange}
  >
    <MenuItem value={"ROLE_CUSTOMER"}>Customer</MenuItem>
    <MenuItem value={"ROLE_RESTAURANT_OWNER"}>Restaurant owner</MenuItem>
  </Field>
</FormControl>

      <Button sx={{marginTop:2, padding:"1rem"}} fullWidth type='submit' variant="contained" color="primary">
        Register
      </Button>
      </Form>
    </Formik>

    <Typography sx={{mt:2}} variant='body2' align={'center'}>
      if you have an account already?
      <Button size='small' onClick={() => navigate("/account/login")}>
        Login
      </Button>
    </Typography>
  </div>
  )
}

export default RegisterForm
