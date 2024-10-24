import React from 'react'

const GameTable = () => {
  return (
    <div>
      <div className='flex h-screen'>
        <div className='flex bg-red-500 w-3/4 '>
            <div className='bg-green-500 w-1/5'>
                players
            </div>
            <div className='bg-blue-500 w-3/5'>
                Game table
            </div>
            <div className='bg-green-500 w-1/5'>
                players
            </div>     
        </div>
        <div className='bg-pink-500 w-1/4 flex'>
            ChatRoom
        </div>
      </div>

    </div>
  )
}

export default GameTable
