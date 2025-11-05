// App.jsx
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routers } from "./Routers/Routers";
import { getMyFavorites, getUser } from "./State/Authentication/Action";
import { findCart } from "./State/Cart/Action";
import { darkTheme } from './Theme/DarkTheme';

function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector(s => s.auth?.access_token);

  useEffect(() => {
    if (accessToken) {
      dispatch(getUser());
      dispatch(findCart());
      dispatch(getMyFavorites());
    }
  }, [accessToken, dispatch]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Routers/>
      <ToastContainer position="top-right" autoClose={1500} />
    </ThemeProvider>
  );
}

export default App;
