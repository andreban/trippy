import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { TripQuery } from "../lib/TripQuery";
import dayjs from "dayjs";

export default function SearchDialog({ open, setOpen,  tripQuery } : { open: boolean, tripQuery: TripQuery, setOpen: (open: boolean) => void}) {
    function handleClose() {
        setOpen(false);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {"This is just a demo app. No real search will be performed."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You've selected a trip to <strong>{tripQuery.destination!} </strong> 
            from <strong>{dayjs(tripQuery.checkIn!).format('YYYY-MM-DD')} </strong>
            to <strong>{dayjs(tripQuery.checkOut!).format('YYYY-MM-DD')} </strong>
            with <strong>{tripQuery.numGuests!} guests </strong>
            and <strong>{tripQuery.numChildren!} children </strong>
            in <strong>{tripQuery.numBedrooms!} rooms</strong>.
            This is just a demo app. No real search will be performed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
}