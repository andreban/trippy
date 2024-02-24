import { Box, Button, TextField, Typography } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { TripQuery } from "../lib/TripQuery"

export default function SearchForm({tripQuery, setTripQuery, onSubmit}: {tripQuery: TripQuery, setTripQuery: (tripQuery: TripQuery) => void, onSubmit: () => void}) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="h5">Hotel Search</Typography>
            <TextField
                name="destination"
                required
                label="Destination"
                variant="standard"
                value={tripQuery.destination || ''}
                fullWidth
                onChange={(e) => {setTripQuery({...tripQuery, destination: e.target.value})}}
                sx={{ mb: 2 }}
            />
            <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, my: 2}}>
            <DatePicker
                name="checkin"
                label="Check in"
                format="YYYY-MM-DD"
                value={dayjs(tripQuery.checkIn)}
                onChange={(e) => {setTripQuery({...tripQuery, checkIn: e ? dayjs(e).toDate(): undefined})}}
                sx={{ minWidth: 145}}
            />
            <DatePicker
                name="checkout"
                label="Check out"
                format="YYYY-MM-DD"
                value={dayjs(tripQuery.checkOut)}
                onChange={(e) => {setTripQuery({...tripQuery, checkOut: e ? dayjs(e).toDate(): undefined})}}
                sx={{ minWidth: 145}}
            />
            <TextField
                name="numguests"
                required id="location"
                label="Guests"
                variant="standard"
                type="number"
                value={tripQuery.numGuests}
                onChange={(e) => {setTripQuery({...tripQuery, numGuests: e.target.value ? Number(e.target.value) : 0})}}
                sx={{ minWidth: 60}}
            />
            <TextField
                name="numchildren"
                required id="location"
                label="Children"
                variant="standard"
                type="number"
                value={tripQuery.numChildren}
                onChange={(e) => {setTripQuery({...tripQuery, numChildren: e.target.value ? Number(e.target.value) : 0})}}
                sx={{ minWidth: 60}}
            />
            <TextField
                name="numrooms"
                required id="location"
                label="Rooms"
                variant="standard"
                type="number"
                value={tripQuery.numBedrooms}
                onChange={(e) => {setTripQuery({...tripQuery, numBedrooms: e.target.value ? Number(e.target.value) : 0})}}
                sx={{ minWidth: 60}}
            />
            </Box>
            <Button variant="contained" onClick={onSubmit}><span>Go</span></Button>
        </LocalizationProvider>
    )
}