import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  TextField,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import {
  forgotVerifyEmail,
  forgotVerifyOtp,
  changePassword,
  resetForgotFlags, // nhớ export action này
} from "../../State/Authentication/Action"; // chỉnh đường dẫn đúng với project

const EmailSchema = Yup.object({
  email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
});

const OtpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP gồm 6 chữ số")
    .required("Bắt buộc"),
});

const PasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Ít nhất 8 ký tự")
    .matches(/[A-Za-z]/, "Phải có chữ")
    .matches(/\d/, "Phải có số")
    .required("Bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Mật khẩu không khớp")
    .required("Bắt buộc"),
});

const steps = ["Xác minh email", "Nhập mã OTP", "Đặt lại mật khẩu"];

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // === Nếu bạn đã gộp flags vào authReducer ===
  const {
    verifyEmailLoading,
    verifyEmailError,
    verifyEmailSuccess,

    verifyOtpLoading,
    verifyOtpError,
    verifyOtpSuccess,

    changePwdLoading,
    changePwdError,
    changePwdSuccess,
  } = useSelector((s) => s.auth || {});
  // === Nếu bạn tách slice 'forgot', đổi thành: const forgot = useSelector(s => s.forgot) ===
  // và map các biến từ forgot.*

  // Local UI state
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  // (Tùy chọn) Đồng bộ theo cờ Redux – vẫn giữ đề phòng reload/route change
  useEffect(() => {
    if (verifyEmailSuccess) setActiveStep(1);
  }, [verifyEmailSuccess]);

  useEffect(() => {
    if (verifyOtpSuccess) setActiveStep(2);
  }, [verifyOtpSuccess]);

  useEffect(() => {
    if (changePwdSuccess) {
      toast.success("Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.");
      // Reset cờ và điều hướng (như bạn đang làm)
      dispatch(resetForgotFlags());
      navigate("/account/login");
    }
  }, [changePwdSuccess, dispatch, navigate]);
  
  useEffect(() => {
    if (changePwdError) {
      const msg = changePwdError?.message || "Đổi mật khẩu thất bại";
      toast.error(msg);
    }
  }, [changePwdError]);

  const emailInitial = useMemo(() => ({ email }), [email]);

  return (
    <Box maxWidth={480} mx="auto" mt={4} px={2}>
      <Typography variant="h5" align="center" fontWeight={800} gutterBottom>
        Quên mật khẩu
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: "text.secondary", mb: 3 }}>
        Làm theo 3 bước để đặt lại mật khẩu tài khoản Hue Food
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Bước 1: Xác minh email */}
      {activeStep === 0 && (
        <Box>
          {verifyEmailError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {verifyEmailError?.message || "Gửi OTP thất bại"}
            </Alert>
          )}

          <Formik
            validationSchema={EmailSchema}
            initialValues={emailInitial}
            enableReinitialize
            onSubmit={async (values, { setSubmitting }) => {
              const e = values.email.trim();
              setEmail(e);
              try {
                await dispatch(forgotVerifyEmail(e)); // thunk phải return/throw
                setActiveStep(1); // nhảy ngay khi thành công
              } catch (err) {
                // lỗi đã hiển thị qua Alert từ Redux; optional: console.error(err)
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched }) => (
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
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />

                <Button
                  sx={{ mt: 2.5, py: 1.25, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={verifyEmailLoading}
                >
                  {verifyEmailLoading ? "Đang gửi OTP..." : "Gửi mã OTP"}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      )}

      {/* Bước 2: Nhập OTP */}
      {activeStep === 1 && (
        <Box>
          {verifyOtpError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {verifyOtpError?.message || "Xác minh OTP thất bại"}
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 2 }}>
            Mã OTP đã gửi tới <strong>{email}</strong>. Vui lòng kiểm tra hộp thư.
          </Alert>

          <Formik
            validationSchema={OtpSchema}
            initialValues={{ otp: "" }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await dispatch(forgotVerifyOtp({ otp: values.otp.trim(), email }));
                setActiveStep(2);
              } catch (err) {
                // lỗi hiển thị qua Alert
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form>
                <Field
                  as={TextField}
                  name="otp"
                  label="Mã OTP (6 số)"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
                  onInput={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 6);
                    if (onlyDigits !== values.otp) setFieldValue("otp", onlyDigits);
                  }}
                  InputProps={{ sx: { borderRadius: 2, letterSpacing: 4 } }}
                  error={touched.otp && !!errors.otp}
                  helperText={touched.otp && errors.otp}
                />

                <Box display="flex" gap={1} mt={2.5}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ py: 1.25, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                    onClick={async () => {
                      try {
                        await dispatch(forgotVerifyEmail(email));
                      } catch {}
                    }}
                    disabled={verifyOtpLoading || verifyEmailLoading}
                  >
                    Gửi lại OTP
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ py: 1.25, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                    type="submit"
                    disabled={verifyOtpLoading}
                  >
                    {verifyOtpLoading ? "Đang xác minh..." : "Xác minh"}
                  </Button>
                </Box>

                <Button
                  size="small"
                  sx={{ mt: 1.5, textTransform: "none", pl: 0 }}
                  onClick={() => {
                    dispatch(resetForgotFlags());
                    setActiveStep(0);
                  }}
                >
                  Sửa email
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      )}

      {/* Bước 3: Đặt lại mật khẩu */}
      {activeStep === 2 && (
        <Box>
          {changePwdError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {changePwdError?.message || "Đổi mật khẩu thất bại"}
            </Alert>
          )}

          {changePwdSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.
            </Alert>
          )}

          <Formik
            validationSchema={PasswordSchema}
            initialValues={{ newPassword: "", confirmPassword: "" }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await dispatch(
                  changePassword({
                    email,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword,
                  })
                );
                // navigate sẽ thực hiện trong useEffect(changePwdSuccess)
              } catch (err) {
                // lỗi hiển thị qua Alert
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  name="newPassword"
                  label="Mật khẩu mới"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type={showPwd ? "text" : "password"}
                  InputProps={{
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPwd((v) => !v)} edge="end">
                          {showPwd ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={touched.newPassword && !!errors.newPassword}
                  helperText={touched.newPassword && errors.newPassword}
                />

                <Field
                  as={TextField}
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  type={showPwd2 ? "text" : "password"}
                  InputProps={{
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPwd2((v) => !v)} edge="end">
                          {showPwd2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />

                <Button
                  sx={{ mt: 2.5, py: 1.25, borderRadius: 2, textTransform: "none", fontWeight: 700 }}
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={changePwdLoading}
                >
                  {changePwdLoading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </Box>
  );
}
