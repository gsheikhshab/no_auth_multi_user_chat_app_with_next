'use client'

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';

interface Chat {
    id: string
    sender: string
    text: string
    incoming? : boolean
}

interface Props {
    chats : Chat[],
    onSend: (text: string) => void
}

export default function ChatComp({chats, onSend} : Props) {
    return (
    <div style={{ position:"relative", height: "500px" }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList>
                {chats.map(chat => (
                    <Message 
                    key = {chat.id}
                    model={{
                        direction: chat.incoming? "incoming" : "outgoing",
                        position: "normal",
                        message: chat.text,
                        //sentTime: "just now",
                        sender: chat.sender
                        }}>
                            </Message>
                ))}
              
              </MessageList>
            <MessageInput placeholder="Type message here" attachButton={false} onSend={onSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
      )
}