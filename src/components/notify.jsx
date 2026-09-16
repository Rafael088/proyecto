"use client"

import React, { useState, useEffect } from 'react';

export default function Notify({msg, closeMsg}) {

    useEffect(() => {
      const timer = setTimeout(()=>{
        closeMsg()
      }, 5000)

      return () => clearTimeout(timer)
    }, [closeMsg])
    


    return(
        <>
            {
                msg && <div className={msg.ok ? "notify-true": "notify-false"}>
                <b> {msg.msg} </b>
        </div>
            }
        </>
        
    )
}