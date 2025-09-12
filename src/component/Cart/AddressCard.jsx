import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Card, Button } from '@mui/material';



const AddressCard = ({ item, showButton, handleSelectAddress }) => {

  return (
    <Card 
      className="flex gap-4 w-64 p-5 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      sx={{ 
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <HomeIcon sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
      <div className='space-y-3 flex-1'>
         <h1 className='font-semibold text-lg text-gray-100'>Nhà riêng</h1>
         <p className="text-sm text-gray-400 leading-relaxed">
            11 Nguyễn Huy Lượng, Phường Phú Hậu, Thành phố Huế
         </p>
         {showButton && (
         <Button 
           variant='outlined' 
           fullWidth 
           onClick={() => handleSelectAddress && handleSelectAddress(item)}
           sx={{ 
             textTransform: 'none',
             borderRadius: 2,
             fontWeight: 600,
             mt: 1
           }}
         >
           Chọn địa chỉ này
         </Button>)}
      </div>
    </Card>
  )
}

export default AddressCard