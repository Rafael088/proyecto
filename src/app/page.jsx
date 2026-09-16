"use client"
import { useEffect } from "react";
import { useRouter} from 'next/navigation';
import './page.css';

export default function Home() {

    const router = useRouter();

    
    return (
        <div className="page" >
                <b>Bienvenido</b>
                <button  onClick={() => router.push("/login")}>
                    Iniciar Sesion
                </button>
                <button onClick={()=> router.push("/register")} >
                    Registrarme
                </button>
        </div>
    );
}