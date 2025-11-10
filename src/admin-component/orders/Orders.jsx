import { Card, RadioGroup, Typography, FormControl, FormControlLabel, Radio, colors } from '@mui/material';
import React, { useState } from 'react'
import { OrderTable } from './OrderTable';

const orderStatus = [
  {label: "All", value: "ALL"},
  {label: "Pending", value: "PENDING"},
  {label: "Completed", value: "COMPLETED"}

]

export const Orders = () => {
  const [filterValue, setFilterValue] = useState("");
  
  const handleFilter = (e, value) => {
    setFilterValue(value);
  }

  return (

  <OrderTable/>


  )
}
