'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import "./headerHomePage.css";
import { Button } from "@/components/ui/button"

export function Header() 
{
    return (
        <header className = "navbar-container">
            <div className = "navbar-item">
                <Link href = "/">
                    <Image src = "/images/LogoHPH.png" alt = "Logo hospital Padre Hurtado" width = {150} height={150}/>
                </Link>
            </div>
            <div className = "navbar-item link">
                <Link href = "/">
                    <Button className='link' variant="link">Acerca de</Button>
                </Link>
            </div>
            <div id = "iniciar-sesion" className = "navbar-item">
                <Button>Iniciar Sesión</Button>
            </div>
        </header>
    );
}
