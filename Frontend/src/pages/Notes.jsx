import React, { Children, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
function Notes() {
    const user = useSelector((state) => state.user);
  
  return (
    <>
    <div className='min-h-[500px] bg-white rounded-lg m-2 p-2'>

      <p>i am Notes of {user.name}</p>
    </div>

    </>
  )
}

export default Notes