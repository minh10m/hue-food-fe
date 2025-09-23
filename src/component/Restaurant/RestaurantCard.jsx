import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Card, Chip, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorite } from '../../State/Authentication/Action';
import { isPresentInFavorites } from '../config/logic';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt') || '';
  const { auth } = useSelector((store) => store);

  // present trong store
  const presentInStore = useMemo(() => isPresentInFavorites(auth.favorites, item), [auth.favorites, item]);

  // optimistic state
  const [liked, setLiked] = useState(presentInStore);
  const [busy, setBusy] = useState(false);

  // đồng bộ lại khi store thay đổi (vd. khi load từ server)
  useEffect(() => setLiked(presentInStore), [presentInStore]);

  const handleAddToFavorites = async (e) => {
    e.stopPropagation(); // không trigger click vào card/ảnh
    if (!jwt || busy) return;

    setBusy(true);
    const prev = liked;
    setLiked(!prev); // OPTIMISTIC: đổi icon ngay

    try {
      await dispatch(addToFavorite(jwt, item.id));
    } catch (err) {
      // rollback nếu lỗi
      setLiked(prev);
    } finally {
      setBusy(false);
    }
  };

  const handleNavigateToRestaurant = () => {
    if (item.open) {
      navigate(`/restaurant/${item.city}/${item.name}/${item.id}`);
    }
  };

  return (
    <Card
      className="w-[18rem] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <div
        onClick={handleNavigateToRestaurant}
        className={`${item.open ? 'cursor-pointer' : 'cursor-not-allowed'} relative group`}
      >
        <img
          className="w-full h-[12rem] object-cover group-hover:scale-105 transition-transform duration-300"
          src={item.image}
          alt={item.name}
        />
        <Chip
          size="small"
          className="absolute top-3 left-3"
          color={item.open ? 'success' : 'error'}
          label={item.open ? 'Đang mở' : 'Đóng cửa'}
          sx={{
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            backgroundColor: item.open ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
            color: 'white',
          }}
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3
              onClick={handleNavigateToRestaurant}
              className="font-bold text-xl cursor-pointer text-gray-100 hover:text-primary.main transition-colors"
            >
              {item.name}
            </h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
          </div>

          {/* Nút Favorite mượt mà */}
          <Tooltip title={liked ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}>
            <span>
              <IconButton
                onClick={handleAddToFavorites}
                disabled={busy}
                aria-pressed={liked}
                aria-label={liked ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
                sx={{
                  color: liked ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(233, 30, 99, 0.1)',
                    color: 'primary.main',
                  },
                  transition: 'transform 120ms ease',
                }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {liked ? (
                    <motion.span
                      key="fav-on"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <FavoriteIcon />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="fav-off"
                      initial={{ scale: 1.15, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.15, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <FavoriteBorderIcon />
                    </motion.span>
                  )}
                </AnimatePresence>
              </IconButton>
            </span>
          </Tooltip>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>⭐ 4.5</span>
          <span>•</span>
          <span>30-45 phút</span>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
