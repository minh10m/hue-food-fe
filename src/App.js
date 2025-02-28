import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import CustomerRoute from './Routers/CustomerRoute';
import { getUser } from "./State/Authentication/Action";
import { findCart } from "./State/Cart/Action";
import { darkTheme } from './Theme/DarkTheme';

function App() {
  const dispatch  = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const {auth} = useSelector(store => store)

  useEffect(() => {
    dispatch(getUser(auth.jwt || jwt));

    dispatch(findCart(jwt));
  }, [auth.jwt])
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <CustomerRoute/>
    </ThemeProvider>
  );
}

export default App;
