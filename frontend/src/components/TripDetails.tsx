import { Paper, Typography } from "@mui/material";

export default function TripDetails() {
    return <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, width: 300 }}>
             <Typography variant="h5">Trip Details</Typography>
             <Typography variant="body1">Destination: - </Typography>
             <Typography variant="body1">Check-in: - </Typography>
             <Typography variant="body1">Check-out: - </Typography>
             <Typography variant="body1">Guests: - </Typography>
             <Typography variant="body1">Children: - </Typography>
           </Paper>
}