import { useState } from "react"

type PropTypes = {
    content:string
    isEdited:boolean | undefined
}

export const Message = ({content,isEdited}:PropTypes) => {

  const isMessageLong = content.length>500
  const [readMore,setReadMore] = useState<boolean>(false)

  const toggleReadMore = ()=>{
    setReadMore(prev=>!prev)
  }

  return (
    <>
    <p className="break-words">
        {
            readMore?content:content.substring(0,400)
        }
        {
            isMessageLong && 
            <span className="font-medium cursor-pointer" onClick={toggleReadMore}>
                {
                    readMore?" Read less":" Read more"
                }...
            </span>
        }
    </p>
    {
        isEdited && 
        <p className="text-secondary self-end font-medium text-sm">Edited</p>
    }
    </>
  )
}





        // editMessageId === message._id ? 
        // <EditMessageForm 
        //   setEditMessageId={setEditMessageId}
        //   prevContentValue={message.content}
        //   messageId={message._id}
        // />
