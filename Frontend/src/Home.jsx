import React, { Children, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
function Home() {
    const user = useSelector((state) => state.user);
  
  return (
    <>
    <div className='min-h-[500px] bg-white rounded-lg m-2 p-2'>

      <p>i am content {user.name}</p>
    </div>

    </>
  )
}

export default Home