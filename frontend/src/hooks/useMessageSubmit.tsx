import { useAppSelector } from "../app/hooks"
import { getSocket } from "../context/socket"
import { Events } from "../enums/events"
import { selectSelectedChatDetails, selectSelectedChatId } from "../features/chat/chatSlice"
import { IMessageEventPayloadData } from "../interfaces/messages"

export const useMessageSubmit = () => {

    const socket = getSocket()
    const selectedChatId = useAppSelector(selectSelectedChatId)
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    const submitMessageHandler = (messageVal:string) => {

        if(selectedChatId && selectedChatDetails){

            const data:IMessageEventPayloadData =  {
                chat:selectedChatId,
                content:messageVal,
                members:selectedChatDetails?.members.map(member=>member._id.toString())
            }

            socket?.emit(Events.MESSAGE,data)
        }
   }

   return submitMessageHandler
}
