'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import "./headerLogin.css";
import { Box } from 'lucide-react';

export function Header() 
{
    return (
        <header className = "navbar-container">
            <div className = "navbar-item">
                <Link href = "/" style = {{display:"flex"}}>
                    <Box/>
                    <h2 style = {{fontSize:"18px", marginLeft:"3px"}}>Agendín</h2>
                </Link>
            </div>
        </header>
    );
}
