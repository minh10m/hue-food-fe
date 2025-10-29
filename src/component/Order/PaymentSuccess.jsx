import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Button, Card } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className='pt-16 md:pt-20 flex justify-center px-4'>
      <Card className='w-full max-w-xl p-8 text-center'>
        <div className='flex justify-center mb-4'>
          <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 56 }} />
        </div>
        <h1 className='text-2xl font-semibold mb-2'>Thanh toán thành công</h1>
        <p className='text-gray-400 mb-6'>
          Cảm ơn bạn đã đặt hàng. Mã đơn của bạn: <span className='text-gray-200 font-medium'>#{id}</span>
        </p>
        <div className='flex gap-3 justify-center'>
          <Button variant='contained' color='primary' onClick={() => navigate('/my-profile/orders')}>Xem đơn hàng</Button>
          <Button variant='outlined' onClick={() => navigate('/')}>Về trang chủ</Button>
        </div>
      </Card>
    </div>
  )
}

export default PaymentSuccess
