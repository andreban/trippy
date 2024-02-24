import { Box, Fade } from "@mui/material";
import { Message } from "../lib/Message";
import MessageCard from "./MessageCard";

export default function Messages({messages} : {messages: Message[]}) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", overflow: 'auto'}}>
            {messages.map((m) =>                 
                <Fade key={m.sequence} in timeout={1500}>
                <Box key={m.sequence} sx={{ display: 'flex', flexDirection: "column" }}>
                    <MessageCard message={m}/>
                </Box>
                </Fade>
            )}
        </Box>
    )
}