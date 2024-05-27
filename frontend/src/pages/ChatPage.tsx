import { useRef } from "react"
import { Helmet } from "react-helmet-async"
import { ChatDetails } from "../components/chat/ChatDetails"
import { ChatHeader } from "../components/chat/ChatHeader"
import { ChatListWithSearch } from "../components/chat/ChatListWithSearch"
import { MessageForm } from "../components/chat/MessageForm"
import { MessageList } from "../components/messages/MessageList"
import { ChatListWithSearchSkeleton } from "../components/ui/skeleton/ChatListWithSearchSkeleton"
import { useFetchAttachments } from "../hooks/useAttachment/useFetchAttachments"
import { useFetchChats } from "../hooks/useChat/useFetchChats"
import { useUpdateChatSelection } from "../hooks/useChat/useUpdateChatSelection"
import { useUpdateUnreadChatAsSeen } from "../hooks/useChat/useUpdateUnreadChatAsSeen"
import { useDeleteChatListener } from "../hooks/useEventListeners/useDeleteChatListener"
import { useFriendRequestListener } from "../hooks/useEventListeners/useFriendRequestListener"
import { useMemberRemovedListener } from "../hooks/useEventListeners/useMemberRemovedListener"
import { useMessageEditListener } from "../hooks/useEventListeners/useMessageEditListener"
import { useMessageListener } from "../hooks/useEventListeners/useMessageListener"
import { useMessageSeenListener } from "../hooks/useEventListeners/useMessageSeenListener"
import { useNewGroupListener } from "../hooks/useEventListeners/useNewGroupListener"
import { useNewMemberAddedListener } from "../hooks/useEventListeners/useNewMemberAddedListener"
import { useOfflineListener } from "../hooks/useEventListeners/useOfflineListener"
import { useOnlineListener } from "../hooks/useEventListeners/useOnlineListener"
import { useTypingListener } from "../hooks/useEventListeners/useTypingListener"
import { useUnreadMessageListener } from "../hooks/useEventListeners/useUnreadMessageListener"
import { useVoteInListener } from "../hooks/useEventListeners/useVoteInListener"
import { useVoteOutListener } from "../hooks/useEventListeners/useVoteOutListener"
import { useFetchFriends } from "../hooks/useFriend/useFetchFriends"
import { useClearAdditionalMessagesOnChatChange } from "../hooks/useMessages/useClearAdditionalMessagesOnChatChange"
import { useFetchMessages } from "../hooks/useMessages/useFetchMessages"
import { useToggleChatBar } from "../hooks/useUI/useToggleChatBar"
import { useToggleChatDetailsBar } from "../hooks/useUI/useToggleChatDetailsBar"
import { useToggleGif } from "../hooks/useUI/useToggleGif"
import { useTogglePoolForm } from "../hooks/useUI/useTogglePoolForm"
import { useGetChatAvatar } from "../hooks/useUtils/useGetChatAvatar"
import { useGetChatName } from "../hooks/useUtils/useGetChatName"
import { useScrollToBottomOnChatChange } from "../hooks/useUtils/useScrollToBottomOnChatChange"
import { useFetchFriendRequest } from "../hooks/userRequest/useFetchFriendRequest"
import { selectLoggedInUser } from "../services/redux/slices/authSlice"
import { selectSelectedChatDetails, selectSelectedChatId } from "../services/redux/slices/chatSlice"
import { selectChatBar, selectChatDetailsBar } from "../services/redux/slices/uiSlice"
import { useAppSelector } from "../services/redux/store/hooks"

export const ChatPage = () => {


   const {isChatsFetching,chats} = useFetchChats()
   useFetchFriends()
   useFetchFriendRequest()
   
   const loggedInUser = useAppSelector(selectLoggedInUser)
   const chatBar = useAppSelector(selectChatBar)
   const chatDetailsBar = useAppSelector(selectChatDetailsBar)
   const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
   const messageContainerRef = useRef<HTMLDivElement>(null)
   const selectedChatId = useAppSelector(selectSelectedChatId)

   
   const {messages,fetchMoreMessages,totalMessagePages} = useFetchMessages(selectedChatDetails?._id,1)
   
   const {fetchMoreAttachments,sharedMedia,isAttachmentsFetching} = useFetchAttachments()
   
   const updateSelectedChatId = useUpdateChatSelection()
   const toggleChatBar = useToggleChatBar()
   const toggleChatDetailsBar = useToggleChatDetailsBar()

   const clearExtraPreviousMessages = useClearAdditionalMessagesOnChatChange()
      
   useScrollToBottomOnChatChange(messageContainerRef,[selectedChatId])

   // listeners
   useFriendRequestListener()
   useMessageListener()
   useMessageSeenListener()
   useNewGroupListener()
   useUnreadMessageListener()
   useOfflineListener()
   useOnlineListener()
   useTypingListener()
   useNewMemberAddedListener()
   useMessageEditListener()
   useDeleteChatListener()
   useMemberRemovedListener()
   useVoteInListener()
   useVoteOutListener()
   
   useUpdateUnreadChatAsSeen(selectedChatDetails)
   
   const toggleGif = useToggleGif()
   const togglePoolForm = useTogglePoolForm()
 
   const getChatName=useGetChatName()
   const getChatAvatar = useGetChatAvatar()
   
   const chatName = getChatName(selectedChatDetails,loggedInUser?._id)
   const chatAvatar= getChatAvatar(selectedChatDetails,loggedInUser?._id)

   const handleFetchMoreAttachments = (chatId:string,page:number)=>{
        fetchMoreAttachments({chatId,page})
   }

   const handleFetchMoreMessages = (_id:string,page:number)=>{
        fetchMoreMessages({_id,page})
   }
   

  return (
    <>
        <Helmet>
            <title>Chat - Baatchit</title>
            <meta name="description" content="Real-time messaging, group chats, file sharing, GIFs, and typing indicators. Stay connected with friends, see who's online, and enjoy seamless communication!" />
            <link rel="canonical" href={`${window.location.origin}`} />
        </Helmet>
        
        <div className="h-full w-full flex p-4 gap-x-6 bg-background">

                <div className={`flex-[.5] p-2 min-w-[15rem] bg-background max-md:fixed ${chatBar?"max-sm:right-0 left-0":"-left-72"} overflow-y-scroll  h-full z-10`}>
                    
                    {
                        !isChatsFetching && chats && loggedInUser ?

                        <ChatListWithSearch
                            clearExtraPreviousMessages={clearExtraPreviousMessages}
                            chats={chats}
                            selectedChatId={selectedChatDetails?._id}
                            loggedInUserId={loggedInUser._id}
                            toggleChatBar={toggleChatBar}
                            updateSelectedChatId={updateSelectedChatId}
                            getChatAvatar={getChatAvatar}
                            getChatName={getChatName}
                        />
                        :
                        <ChatListWithSearchSkeleton/>
                    }
                    
                </div>

                <div className="flex-[1.6]">

                        <div className="flex flex-col gap-y-3 h-full">
                            
                            {
                                selectedChatDetails && chatName &&

                                <ChatHeader
                                    chatName={chatName}
                                    totalMembers={selectedChatDetails.members.length}
                                    toggleChatDetailsBar={toggleChatDetailsBar}
                                />
                            }

                            {
                                selectedChatDetails && messages && loggedInUser && totalMessagePages &&

                                <MessageList
                                    messageContainerRef={messageContainerRef}
                                    selectedChatDetails={selectedChatDetails}
                                    isGroupChat={selectedChatDetails.isGroupChat} 
                                    messages={messages} 
                                    totalPages={totalMessagePages}
                                    loggedInUserId={loggedInUser._id}
                                    fetchMoreMessages={handleFetchMoreMessages}
                                />
                            }
                                
                            {/* <SeenByList members={selectedChatDetails.seenBy}/>

                            <TypingIndicatorWithUserList 
                                isGroupChat={selectedChatDetails.isGroupChat}
                                users={selectedChatDetails.userTyping}
                            /> */}
                            
                            {
                                selectedChatDetails &&

                                <MessageForm 
                                toggleGif={toggleGif}
                                togglePoolForm={togglePoolForm}
                                />  
                            }

                        </div>
                        
                </div>

                <div className={`flex-[.6] bg-background max-sm:w-full max-2xl:fixed ${!chatDetailsBar?"max-2xl:-right-[50rem]":""} ${chatDetailsBar?"max-2xl:right-0":""}  max-2xl:px-4 max-2xl:w-[25rem]`}>
                    {
                        !isChatsFetching && chats && loggedInUser && selectedChatDetails && chatName && chatAvatar && sharedMedia &&

                        <ChatDetails
                        isAdmin={selectedChatDetails.admin===loggedInUser._id}
                        isGroupChat={selectedChatDetails.isGroupChat}
                        chatName={chatName}
                        chatAvatar={chatAvatar}
                        members={selectedChatDetails.members}
                        attachments={sharedMedia}
                        isAttachmentsFetching={isAttachmentsFetching}
                        selectedChatId={selectedChatDetails._id}
                        toggleChatDetailsBar={toggleChatDetailsBar}
                        fetchMoreAttachments={handleFetchMoreAttachments}
                        />
                    }
                </div>
                
        </div>
    </>
  )
}
