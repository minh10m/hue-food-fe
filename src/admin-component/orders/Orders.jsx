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
    <div className='px-2'>
  <Card className='p-5'>
    <Typography sx={{ paddingBottom: "1rem" }} variant="h5">
      Order Status
    </Typography>

    <FormControl>
      <RadioGroup
        onChange={handleFilter}
        row
        name="category"
        value={filterValue || ""}
      >
        {orderStatus.map((item) => <FormControlLabel
          key={item.label}
          value={item.value}
          control={<Radio/>}
          label={item.label}
          sx={colors.grey}
          
        />)}
      </RadioGroup>
    </FormControl>
  </Card>

  <OrderTable/>
</div>

  )
}
