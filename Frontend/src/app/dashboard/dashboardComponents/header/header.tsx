'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import "./header.css";
import { Button } from "@/components/ui/button"

export function Header() 
{
    return (
        <header className = "dashboard-navbar-container">
            <div className = "dashboard-navbar-item">
                <Link href = "/">
                    <Image src = "/images/LogoHPH.png" alt = "Logo hospital Padre Hurtado" width = {150} height={150}/>
                </Link>
            </div>
        </header>
    );
}
