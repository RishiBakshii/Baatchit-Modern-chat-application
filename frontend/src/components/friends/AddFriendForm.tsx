import { useEffect, useState } from "react"
import { UserList } from "./UserList"
import { useToast } from "../../hooks/useUI/useToast"
import { useSendFriendRequestMutation } from "../../services/api/requestApi"
import { useLazySearchUserQuery } from "../../services/api/userApi"

export const AddFriendForm = () => {

    const [inputVal,setInputVal] = useState<string>()
    const [searchUserTrigger,{data:users,isFetching,error:queryError,isUninitialized:isQueryUninitialized,isSuccess:isQuerySuccess,isError:isQueryError}] = useLazySearchUserQuery()
    const [sendFriendRequestTrigger,{error,isError,isLoading,isSuccess,isUninitialized}] = useSendFriendRequestMutation()

    useToast({
        error,
        isError,
        isLoading,
        isSuccess,
        isUninitialized,
        loaderToast:true,
        successToast:true,
        successMessage:"Friend request sent",
    })

    useToast({
        isLoading:isFetching,
        error:queryError,
        isError:isQueryError,
        isSuccess:isQuerySuccess,
        isUninitialized:isQueryUninitialized,
    })

    useEffect(()=>{
        let timeoutId:number

        if(inputVal?.trim().length){
            timeoutId = setTimeout(()=>{
                searchUserTrigger(inputVal)
            },1000)
        }

        return () => {
            clearInterval(timeoutId)
        }

    },[inputVal])

    const sendFriendRequest = (receiverId:string)=>{
        sendFriendRequestTrigger({receiverId})
    }

  return (
    <div className="flex flex-col gap-y-4">

        <input value={inputVal} onChange={e=>setInputVal(e.target.value)} className="p-3 rounded text-text bg-background w-full outline outline-1 outline-secondary-darker" type="text" placeholder="Search username"/>
        
        <div>
            {
                !isFetching && users && 
                <UserList 
                 users={users} 
                 sendFriendRequest={sendFriendRequest}
                />
            }
            {
                !inputVal?.trim() && !users &&
                <div className="flex items-center justify-center">
                    <p >Go on try the speed!</p>
                </div>
            }
        </div>
        
    </div>
  )
}
