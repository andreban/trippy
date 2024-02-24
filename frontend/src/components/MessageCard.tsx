import { Card, Typography } from "@mui/material";
import { Message } from "../lib/Message";
import Markdown from "react-markdown";

export default function MessageCard({message} : {message: Message}) {
    const alignment = message.sender == 'user' ? 'end' : 'start';
    const senderName = message.sender == 'user' ? 'You' : '✨Trippy';
    const backgroundColor = message.sender == 'user' ? 'PowderBlue' : 'LightCyan';

    return (
        <Card sx={{ m: 2, p: 2, width: "80%", alignSelf: alignment, textAlign: alignment, backgroundColor: backgroundColor, flexShrink:0}}>
            <Typography variant="h6">{senderName}</Typography>
            <Markdown>{message.content}</Markdown>
        </Card>
    )
}
