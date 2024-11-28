'use client'

import React, { useEffect, useState } from 'react'
import ChatComp from '@/app/components/chat';
import { Chat } from '@/src/API';
import { chatsByChatroom } from '@/src/graphql/queries';
import { client } from '@/app/lib/client';
import { useParams } from 'next/navigation';
import { onCreateChat } from '@/src/graphql/subscriptions';
import { createChat } from '@/src/graphql/mutations';

/*interface PageProps {
    params: {
        chatroomId: string;
        userId: string; 
    }
}*/

export default function CahtRoom() { //({params}: PageProps) {

    const [chats, setChats] = useState<Chat[]>([]);
    const params = useParams();
    const chatroomIdArray: string[] = 
    params.chatroomId ? 
        (Array.isArray(params.chatroomId)?
        params.chatroomId :
            [params.chatroomId]) : [""];
    const userIdArray: string[] = 
    params.userId ? 
        (Array.isArray(params.userId)?
        params.userId :
            [params.userId]) : [""];

    const chatroomId: string = chatroomIdArray.at(0)!;
    const userId: string = userIdArray.at(0)!;

    useEffect(() => {
        client.graphql({
            query: chatsByChatroom,
            variables: {
                chatroomId: chatroomId ,
            },
        })
        .then((res) => {
            setChats(res.data.chatsByChatroom.items);
        })
    }, [params.chatroomId]);

    useEffect(() => {
        const subscription =  client.graphql({
            query: onCreateChat, 
            variables: {
                filter: {
                    chatroomId: {
                        eq: chatroomId
                    }
                }
            }

        }).subscribe({
            next(value){
                setChats(chats => [...chats, value.data.onCreateChat])
            },
        }); 

        return ()=> {
            subscription.unsubscribe();
        }
    }, [params.chatroomId]);

    async function handleSend(text: string) {
        await client.graphql(
            {
                query: createChat,
                variables: {
                    input: {
                        chatId: "123", // this should be removed. The chatId is useless??.
                        chatroomId: chatroomIdArray.at(0)!,
                        sender: userId, 
                        text
                    }
                }
            }
        );
    }

    return (<div><ChatComp chats={
        chats.map(chat => ({...chat,
            incoming: chat.sender !== params.userId}))
    } onSend={handleSend} /></div>)
    //return (<div> {JSON.stringify(chats)} </div>);
  }