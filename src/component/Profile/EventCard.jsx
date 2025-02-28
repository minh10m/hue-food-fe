import { Card, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
const EventCard = () => {
  return (
    <div>
      <Card sx={{width:350}}>
         <CardMedia
         sx={{height:345}}
          image='https://i.pinimg.com/236x/80/f0/5e/80f05eb75bea006de7364f102fd7b407.jpg'/>

          <CardContent>
            <Typography variant='h5'>
                Phở bò
            </Typography>
            <Typography variant='body1'>
               sale 50% 
            </Typography>
            <div className='py-2 space-y-2'>
               <p>
                 quán 
               </p>
               <p className='text-sm text-blue-400'>ngày 10 tháng 10 năm 2024, 12:00 AM</p>
               <p className='text-sm text-red-400'>ngày 11 tháng 10 năm 2024, 12:00 PM</p>
            </div>
          </CardContent>
         { false && 
          <CardActions>
            <IconButton>
               <DeleteIcon/>
            </IconButton>
          </CardActions>}
      </Card>
    </div>
  )
}

export default EventCard