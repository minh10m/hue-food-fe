import React, { useMemo } from "react";
import {
  Button,
  Card,
  CardHeader,
  Grid,
  CardContent,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useSelector, useDispatch } from "react-redux";
import { updateRestaurantStatus } from "../../State/Restaurant/Action"

export const RestaurantDetails = () => {
  const dispatch = useDispatch();
  const {usersRestaurant} = useSelector(
    (store) => store.restaurant
);

  const restaurant = useMemo(
    () => usersRestaurant ?? null,
    [usersRestaurant]
  );

  const isOpen = !!(restaurant && restaurant.open === true);

  const handleRestaurantStatus = () => {
    if (!restaurant) return;
    dispatch(updateRestaurantStatus({ restaurantId: restaurant.id }));
  };

  const InfoRow = ({ label, children }) => (
    <div className="flex items-start sm:items-center">
      <p className="w-48 font-medium text-gray-300">{label}</p>
      <p className="text-gray-400 ml-2">{children ?? "-"}</p>
    </div>
  );

  return (
    <div>
      <div className="lg:px-20 px-5">
        <div className="py-5 flex flex-col sm:flex-row justify-between items-center gap-5">
          <h1 className="text-2xl lg:text-4xl text-center font-bold p-2">
            {restaurant?.name ?? "Restaurant name"}
          </h1>

          <div>
            <Button
              color={isOpen ? "success" : "error"}
              className="py-3 px-6"
              variant="contained"
              onClick={handleRestaurantStatus}
              size="large"
              aria-pressed={isOpen}
              aria-label={isOpen ? "Close restaurant" : "Open restaurant"}
            >
              {isOpen ? "Close" : "Open"}
            </Button>
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title={<span className="text-gray-300">Restaurant</span>}
              />
              <CardContent>
                <div className="space-y-4 text-gray-200">
                  <InfoRow label="Owner">
                    {restaurant?.ownerFullName ?? "-"}
                  </InfoRow>

                  <InfoRow label="Restaurant Name">{restaurant?.name}</InfoRow>

                  <InfoRow label="Cuisine Type">{restaurant?.cuisineType}</InfoRow>

                  <InfoRow label="Opening Hours">
                    {restaurant?.openingHours ?? "Mon–Sun: 9:00 AM - 10:00 PM"}
                  </InfoRow>

                  <InfoRow label="Status">
                    {isOpen ? (
                      <span className="px-4 py-1 rounded-full bg-green-400 text-gray-900">
                        Open
                      </span>
                    ) : (
                      <span className="px-4 py-1 rounded-full bg-red-400 text-gray-900">
                        Closed
                      </span>
                    )}
                  </InfoRow>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title={<span className="text-gray-300">Address</span>} />
              <CardContent>
                <div className="space-y-4 text-gray-200">
                  <InfoRow label="City">{restaurant?.address?.city}</InfoRow>
                  <InfoRow label="Street Address">
                    {restaurant?.address?.street}
                  </InfoRow>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title={<span className="text-gray-300">Contact</span>} />
              <CardContent>
                <div className="space-y-4 text-gray-200">
                  <InfoRow label="Email">{restaurant?.contactInformation?.email}</InfoRow>
                  <InfoRow label="Mobile">{restaurant?.contactInformation?.mobile}</InfoRow>

                  <div className="flex items-center gap-4 pb-4">
                    <p className="w-48 font-medium text-gray-300">Social</p>
                    <div className="flex gap-4 items-center">
                      {restaurant?.contactInformation?.instagram ? (
                        <a
                          href={restaurant.contactInformation.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram"
                        >
                          <InstagramIcon sx={{ fontSize: "2.25rem" }} />
                        </a>
                      ) : (
                        <InstagramIcon sx={{ fontSize: "2.25rem", opacity: 0.4 }} />
                      )}

                      {restaurant?.contactInformation?.twitter ? (
                        <a
                          href={restaurant.contactInformation.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter"
                        >
                          <TwitterIcon sx={{ fontSize: "2.25rem" }} />
                        </a>
                      ) : (
                        <TwitterIcon sx={{ fontSize: "2.25rem", opacity: 0.4 }} />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
