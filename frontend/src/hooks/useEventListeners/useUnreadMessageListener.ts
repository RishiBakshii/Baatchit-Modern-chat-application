import { getSocket } from "../../context/socket"
import { Events } from "../../enums/events"
import type { IMessageSeenEventPayloadData, IUnreadMessageEventReceiveData } from "../../interfaces/messages"
import { chatApi } from "../../services/api/chatApi"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useUnreadMessageListener = () => {

    const socket = getSocket()
    const dispatch = useAppDispatch()

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useSocketEvent(Events.UNREAD_MESSAGE,(data:IUnreadMessageEventReceiveData)=>{

        if(data.chatId === selectedChatDetails?._id){
    
          const payload:IMessageSeenEventPayloadData =  
          {
            chatId:selectedChatDetails._id,
            members:selectedChatDetails.members.map(member=>member._id)
          }
    
          socket?.emit(Events.MESSAGE_SEEN,payload)
        }
        else{
          dispatch(
            chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
      
              const chat = draft.find(draft=>draft._id===data.chatId)
      
              if(chat){
                chat.unreadMessages.count++
                chat.unreadMessages.message = data.message
                chat.unreadMessages.sender = data.sender
              }
              
            })
          )
        }
    
      })
}