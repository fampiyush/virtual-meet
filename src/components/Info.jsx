import React,{ useState } from 'react'
import { useParams } from 'react-router-dom'
import { IoMdInformationCircleOutline } from "react-icons/io"
import { MdOutlineContentCopy } from "react-icons/md"
import { IoClose } from "react-icons/io5"

const Info = () => {

    const [showModal, setShowModal] = useState(false)

    const { meetingId } = useParams()

    const baseUrl = import.meta.env.VITE_BASE_URL

    const onClick = () => {
        setShowModal(true)
    }

    const copyLink = async() => {
        try {
            await navigator.clipboard.writeText(`${baseUrl}${meetingId}`)
        } catch (error) {
            alert('Failed to copy link')
        }
    }

    const copyId = async() => {
        try {
            await navigator.clipboard.writeText(meetingId)
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
            <div className='fixed top-1 left-1 z-20 lg:max-w-[20%] md:max-w-[30%] max-w-[50%] p-2 bg-[#5c89d1] rounded flex-col text-center'>
                <div className='absolute right-1 top-1'>
                    <button className='active:opacity-50' onClick={() => setShowModal(false)}>
                        <IoClose size={25} color='#fff' />
                    </button>
                </div>
                <h1 className='text-lg'>Virtual Meet</h1>
                <div className='grid grid-rows-4 grid-cols-2 mt-4 gap-2'>
                    <div className='max-w-[fit-content]'>Meeting Id: </div>
                    <div className='flex'>
                        <span className='bg-[#575857] rounded px-1 mr-1'>{meetingId}</span>
                        <button className='mt-[0.05rem] active:opacity-50' onClick={copyId}>
                            <MdOutlineContentCopy size={20} color='#fff' />
                        </button>
                    </div>
                    <div className='max-w-[fit-content]'>Meeting Link:</div>
                    <div className='row-span-3 break-words'>
                        <span>{baseUrl}{meetingId}</span>
                        <button className='text-sm flex text-center mt-2 max-w-[fit-content] bg-[#dfdcdc] rounded px-1 active:opacity-50' onClick={copyLink}>
                            <span className='mr-1 text-[#0000EE]'>Copy Link</span>
                            <span className='mt-[0.2rem]'>
                                <MdOutlineContentCopy color='#0000EE' />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        }
        </>
  )
}

export default Info