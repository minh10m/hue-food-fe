import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../State/Cart/Action";
import { categorizeIngredients } from "../Util/categorizeIngredients";


const MenuCard = ({item}) => {

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const dispatch = useDispatch();

  const handleCheckBoxChange = (itemName) =>{
    console.log("value",itemName);
    if (selectedIngredients.includes(itemName)){
      setSelectedIngredients(selectedIngredients.filter((item) => item !== itemName))
    }
    else {
      setSelectedIngredients([...selectedIngredients, itemName])
    }
  }

  const handleAddItemToCart = (e) => {
    e.preventDefault();
    const reqData = {
      token: localStorage.getItem('jwt'),
      cartItem: {
        foodId: item.id, 
        quantity: 1,
        ingredients: selectedIngredients
      }
    };

    dispatch(addItemToCart(reqData));

    console.log("reqData", reqData);
  };
  
  return (
    <Accordion 
      sx={{ 
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 2,
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: 0 }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{ 
          px: 3,
          py: 2,
          '&.Mui-expanded': { minHeight: 'auto' },
          '& .MuiAccordionSummary-content': { margin: '12px 0' }
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <img
              className="w-20 h-20 object-cover rounded-xl"
              src={item.images[0]}
              alt={item.name}
            />

            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-100 mb-1">{item.name}</h3>
              <p className="text-lg font-semibold text-primary.main mb-1">
                {(item.price/1000).toLocaleString()}.000đ
              </p>
              <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
            </div>
          </div>
        </div>
      </AccordionSummary>
      
      <AccordionDetails sx={{ px: 3, pb: 3 }}>
        <form onSubmit={handleAddItemToCart}>
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-100 mb-4">Tùy chọn thành phần</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {
                Object.keys(categorizeIngredients(item.ingredients)).map((category) => 
                  <div key={category} className="bg-gray-800/30 rounded-lg p-4">
                    <h5 className="font-medium text-gray-200 mb-3">{category}</h5>
                    <FormGroup>
                      {categorizeIngredients(item.ingredients)[category].map((ingredient) => 
                        <FormControlLabel 
                          key={ingredient.id} 
                          control={
                            <Checkbox 
                              checked={selectedIngredients.includes(ingredient.name)}
                              onChange={() => handleCheckBoxChange(ingredient.name)}
                              sx={{ color: 'primary.main' }}
                            />
                          } 
                          label={<span className="text-gray-300">{ingredient.name}</span>} 
                        />
                      )}
                    </FormGroup>
                  </div>
                )
              }
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="contained" 
              disabled={false} 
              type="submit"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5
              }}
            >
              {true ? "Thêm vào giỏ hàng" : "Hết hàng"}
            </Button>
          </div>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default MenuCard;
