import { Button, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginUser } from '../../State/Authentication/Action'


const initialValues = { email: "", password: "" }

const LoginForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { auth } = useSelector((store) => store)

  const [hasSubmitted, setHasSubmitted] = useState(false);

const handleSubmit = (values) => {
  setHasSubmitted(true);
  dispatch(loginUser({ userData: values, navigate }));
};

useEffect(() => {
  if (!hasSubmitted) return; // ⛔ skip on first render

  if (auth?.error) {
    toast.error("Đăng nhập thất bại do sai mật khẩu hoặc tài khoản");
  }
  if (auth?.success === "Login success") {
    toast.success("Đăng nhập thành công!");
  }
}, [auth?.error, auth?.success, hasSubmitted]);


  return (
    <div>
      <Typography className='text-center' variant='h5' sx={{ fontWeight: 800, mb: 1 }}>
        Chào mừng trở lại
      </Typography>
      <Typography variant='body2' align='center' sx={{ color: 'text.secondary', mb: 1.5 }}>
        Đăng nhập để tiếp tục trải nghiệm Hue Food
      </Typography>

      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        <Form>
          <Field
            as={TextField}
            name="email"
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            type="email"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <Field
            as={TextField}
            name="password"
            label="Mật khẩu"
            fullWidth
            variant="outlined"
            margin="normal"
            type="password"
            InputProps={{ sx: { borderRadius: 2 } }}
          />

          <Button
            size="small"
            onClick={() => navigate("/account/forgot-password")}
            sx={{ textTransform: 'none', mt: 1, pl: 0 }}
          >
            Quên mật khẩu?
          </Button>

          <Button
            sx={{ mt: 2.5, py: 1.25, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            fullWidth
            type='submit'
            variant="contained"
            color="primary"
          >
            Đăng nhập
          </Button>
        </Form>
      </Formik>

      <Typography sx={{ mt: 2 }} variant='body2' align={'center'}>
        Chưa có tài khoản?
        <Button
          size='small'
          onClick={() => navigate("/account/register")}
          sx={{ textTransform: 'none', ml: .5 }}
        >
          Đăng ký
        </Button>
      </Typography>
    </div>
  )
}

export default LoginForm
