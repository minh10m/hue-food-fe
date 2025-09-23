
import { Button, TextField, Typography, Alert } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../State/Authentication/Action'


const initialValues = {
    email:"",
    password:"",

}
const LoginForm = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { auth } = useSelector((store) => store)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.')

  useEffect(() => {
    if (auth?.error) {
      const msg = auth.error?.response?.data?.message || auth.error?.message || errorMsg
      setErrorMsg(msg)
      setErrorOpen(true)
    }
  }, [auth?.error])

  const handleSubmit = (values) => {
    dispatch(loginUser({userData: values, navigate}))

  }
  return (
    <div>
      <Typography className='text-center' variant='h5' sx={{ fontWeight: 800, mb: 1 }}>
        Chào mừng trở lại
      </Typography>
      <Typography variant='body2' align='center' sx={{ color: 'text.secondary', mb: 1.5 }}>
        Đăng nhập để tiếp tục trải nghiệm Hue Food
      </Typography>

      {errorOpen && (
        <Alert role="alert" severity="error" variant="filled" sx={{ mb: 2 }} onClose={() => setErrorOpen(false)}>
          {errorMsg}
        </Alert>
      )}

      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        <Form>
        <Field as={TextField} 
            name = "email"
            label = "Email"
            fullWidth 
            variant="outlined"
            margin="normal"
            type="email"
            InputProps={{ sx: { borderRadius: 2 } }}
        />
        <Field as={TextField} 
            name = "password"
            label = "Mật khẩu"
            fullWidth 
            variant="outlined"
            margin="normal"
            type="password"
            InputProps={{ sx: { borderRadius: 2 } }}
        />

        <Button sx={{ mt: 2.5, py: 1.25, borderRadius: 2, textTransform: 'none', fontWeight: 700 }} fullWidth type='submit' variant="contained" color="primary">
          Đăng nhập
        </Button>
        </Form>
      </Formik>

      <Typography sx={{mt:2}} variant='body2' align={'center'}>
        Chưa có tài khoản?
        <Button size='small' onClick={() => navigate("/account/register")} sx={{ textTransform: 'none', ml: .5 }}>
          Đăng ký
        </Button>
      </Typography>
    </div>
  )
}

export default LoginForm