"use client"
import React, { use, useState } from 'react';
import { useRouter} from 'next/navigation';
import '../../styles/login.css';
import Notify from '../../components/notify.jsx';

export default function Login() {
    const [user, setUser] = useState();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState();
    const router = useRouter();



    async function login() {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/login`
        let db = {
            email,
            password
        }

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(db)
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok) {
                    setUser(data.user)
                    setMsg()
                    router.push("/home")
                }else{
                    setUser()
                    setMsg({    
                        msg: data.msg,
                        ok: false
                    })
                }

                
            })
            .catch((err) => console.log("Ocurrio un error" + err))
    }

    function closeMsg() {
        setMsg()
    }

    return (
        <div className='login' >
                <h1>Inicia Sesion para continuar</h1>
                <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder='Correo Electronico' />
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder='Contraseña' />

                <button onClick={() => login()}>
                    Login
                </button>
                {
                    msg ? <>
                    
                <Notify  msg={msg} closeMsg={() => closeMsg()} />
                    
                    </>:<></>
                }
        </div>
    );
}