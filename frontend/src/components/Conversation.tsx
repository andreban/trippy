import { Send } from "@mui/icons-material";
import { Box, Button, Card, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Message } from "../lib/Message";

let NEXT_MESSAGE_ID: number = 0;
const MESSAGES: Message[] = [
    {sequence: NEXT_MESSAGE_ID++, content: 'Hello, where do you want to travel to?', sender: 'bot'},
];

function ConversationCard({message} : {message: Message}) {
    const alignment = message.sender == 'user' ? 'end' : 'start';
    const senderName = message.sender == 'user' ? 'You' : '✨Trippy';
    const backgroundColor = message.sender == 'user' ? 'PowderBlue' : 'LightCyan';

    return (
        <Card sx={{ m: 2, p: 2, width: "80%", alignSelf: alignment, textAlign: alignment, backgroundColor: backgroundColor}}>
            <Typography variant="h6">{senderName}</Typography>
            <Typography variant="body2">{message.content}</Typography>
        </Card>
    )
}

export default function Conversation() {
    const [userMessage, setUserMessage] = useState<string>();
    const [messages, setMessages] = useState<Message[]>(MESSAGES);
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        if (!userMessage) {
            return;
        }
        // Fetch from server...
        const robotMessage: Message = {
            sequence: NEXT_MESSAGE_ID++,
            sender: 'bot',
            content: 'Hello, World!',            
        };
        setMessages(m => [...m, robotMessage]);

    }, [userMessage]);

    function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setInput(e.target.value);
    }

    function onButtonClick() {
        const newMessage: Message = {
            sequence: NEXT_MESSAGE_ID++,
            sender: 'user',
            content: input,
        };
        setUserMessage(input);
        setMessages([...messages, newMessage]);
        setInput('');
    }

    return (
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, flexGrow: 1 }}>
            <Typography variant="h5">Trippy Conversation</Typography>
            <Box sx={{ display: "flex", flexDirection: "column"}}>
                {messages.map((m) => <ConversationCard key={m.sequence} message={m}/> )}
            </Box>
            <Box sx={{ display: "flex" }}>
                <TextField id="standard-basic" label="Input" variant="standard"  sx={{width: "100%"}} onChange={onInputChange}/>
                <Button onClick={onButtonClick}><Send /></Button>
            </Box>
        </Paper>
    )
}