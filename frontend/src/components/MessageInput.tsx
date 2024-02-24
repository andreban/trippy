import { Send } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

export default function MessageInput({onSend} : {onSend: (message: string) => void}) {
    const [input, setInput] = useState<string>('');

    function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setInput(e.target.value);
    }

    function onKeyDown(e: any) {
        if (e.key === 'Enter') {
            onButtonClick();
        }
    }

    function onButtonClick() {
        onSend(input);
        setInput('');
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
            <TextField 
                id="standard-basic"
                label="Input"
                variant="standard"
                sx={{width: "100%"}}
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
            />
            <Button onClick={onButtonClick}><Send /></Button>
        </Box>
    );
}