import React from 'react'

const Notification = ({ show, message }) => {
  return (
    <div className={`fixed top-1 right-2 z-20 ${show ? "" : "hidden"}`}>
        <div className={`p-2 bg-[#5c89d1] rounded ${show ? '' : 'hidden'}`}>
            {message}
        </div>
    </div>
  )
}

export default Notification