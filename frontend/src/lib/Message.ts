export type Message = {
    sequence: number,
    sender: 'user' | 'bot';
    content: string;
}

