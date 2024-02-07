import React,{useEffect} from 'react'

const OwnVideo = ({videoStreamRef, isOwnVideo}) => {
  
  useEffect(() => {
    if(isOwnVideo){
      const video = document.getElementById('myVideo')
      video.srcObject = videoStreamRef.current
    }
  },[isOwnVideo])

  return (
    <div className='fixed bottom-0 left-0 z-20'>
      {
        isOwnVideo ?
        <div className='w-52'>
          <video id='myVideo' autoPlay playsInline muted />
        </div>
        : 
        <img src='/placeholder.jpg' className='h-40 w-52' />
      }
    </div>
  )
}

export default OwnVideo