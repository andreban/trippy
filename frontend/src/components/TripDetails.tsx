import { Paper, Typography } from "@mui/material";
import { TripQuery } from "../lib/TripQuery";

export default function TripDetails({details} : {details?: TripQuery}) {
    return <Paper variant="outlined" sx={{ my: { xs: 3, md: 2 }, p: { xs: 2, md: 3 }, width: 300, minWidth: 300 }}>
             <Typography variant="h5">Trip Details</Typography>
             <Typography variant="body1">Destination: {details?.destination || '-'} </Typography>
             <Typography variant="body1">Check-in: {details?.checkIn?.toString() || '-'} </Typography>
             <Typography variant="body1">Check-out: {details?.checkOut?.toString() || '-'} </Typography>
             <Typography variant="body1">Guests: {details?.numGuests || '-'} </Typography>
             <Typography variant="body1">Children: {details?.numChildren || '-'} </Typography>
             <Typography variant="body1">Bedrooms: {details?.numBedrooms || '-'} </Typography>
           </Paper>
}