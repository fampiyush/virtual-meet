import React,{ useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { PlayerContext } from '../helpers/contextProvider'
import { IoMdInformationCircleOutline } from "react-icons/io"
import { MdOutlineContentCopy, MdLock } from "react-icons/md"
import { IoClose } from "react-icons/io5"
import { FaCheck } from "react-icons/fa6"

const Info = () => {
    
    const { isAdmin } = useContext(PlayerContext)
    const [showModal, setShowModal] = useState(isAdmin)
    const [checkId, setCheckId] = useState(false)
    const [checkLink, setCheckLink] = useState(false)

    const { meetingId } = useParams()

    const baseUrl = import.meta.env.VITE_BASE_URL

    const onClick = () => {
        setShowModal(true)
    }

    let timeoutLink
    const copyLink = async() => {
        clearTimeout(timeoutLink)
        try {
            await navigator.clipboard.writeText(`${baseUrl}${meetingId}`)
            setCheckLink(true)
            timeoutLink = setTimeout(() => {
                setCheckLink(false)
            }, 2000)
        } catch (error) {
            alert('Failed to copy link')
        }
    }

    let timeoutId
    const copyId = async() => {
        clearTimeout(timeoutId)
        try {
            await navigator.clipboard.writeText(meetingId)
            setCheckId(true)
            timeoutId = setTimeout(() => {
                setCheckId(false)
            }, 2000)
        } catch (error) {
            alert('Failed to copy link')
        }
    }
  
    return (
        <>
        {
            !showModal ?
            <button className='fixed top-2 left-1 z-20 w-[3rem] flex text-center justify-center' onClick={onClick}>
                <IoMdInformationCircleOutline size={30} color='#5c89d1' />
            </button>
            :
            <div className='fixed top-1 left-1 z-20 2xl:max-w-[20%] xl:max-w-[25%] lg:max-w-[30%] md:max-w-[35%] max-w-[55%] p-2 bg-[#5c89d1] rounded flex-col text-center'>
                <div className='absolute right-1 top-1'>
                    <button className='active:opacity-50 hover:bg-gray-400 rounded-full' onClick={() => setShowModal(false)}>
                        <IoClose size={25} color='#fff' />
                    </button>
                </div>
                <h1 className='text-lg'>Virtual Meet</h1>
                <div className='grid grid-rows-4 grid-cols-2 mt-4 gap-2'>
                    <div className='max-w-[fit-content]'>Meeting Id: </div>
                    <div className='flex'>
                        <div className='flex bg-[#575857] p-1 rounded max-w-[fit-content]'>
                            <span className='rounded px-1 mr-1'>{meetingId}</span>
                            <button className='mt-[0.05rem] active:opacity-50' onClick={copyId}>
                                <MdOutlineContentCopy size={20} color='#fff' />
                            </button>
                        </div>
                        <div className={`ml-1 mt-2 ${checkId ? '' : 'hidden'}`}>
                            <FaCheck color='#39fa73' />
                        </div>
                    </div>
                    <div className='max-w-[fit-content]'>Meeting Link:</div>
                    <div className='row-span-3 break-words'>
                        <span className='text-sm'>{baseUrl}{meetingId}</span>
                        <div className='flex'>
                            <button className='text-sm flex text-center mt-2 max-w-[fit-content] bg-[#dfdcdc] rounded px-1 active:opacity-50' onClick={copyLink}>
                                <span className='mr-1 text-[#0000EE]'>Copy Link</span>
                                <span className='mt-[0.2rem]'>
                                    <MdOutlineContentCopy color='#0000EE' />
                                </span>
                            </button>
                            <div className={`ml-1 mt-2 ${checkLink ? '' : 'hidden'}`}>
                                <FaCheck color='#39fa73' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='text-xs mt-4 flex justify-center text-center'>
                    <span>This Meeting is end-to-end encrypted.</span>
                    <span className='ml-1 mt-[0.1rem]'><MdLock color='#39fa73' /></span>
                </div>
            </div>
        }
        </>
  )
}

export default Info