'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import "./headerLogin.css";
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
        </header>
    );
}
