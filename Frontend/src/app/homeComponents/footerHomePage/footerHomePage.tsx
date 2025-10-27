'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Youtube, Linkedin } from 'lucide-react';
import "./footerHomePage.css";
import { Button } from "@/components/ui/button"

export function Footer() 
{
    return (
        <header className = "footer-container">
            <div className = "footer-item name">
                Icaros Sols © 2025. Derechos reservados
            </div>
            <div className = "footer-item link-container">
                <Link href = "/">
                    <Button className='link' variant="link">
                        <Youtube size = {30}/>
                        Youtube
                    </Button>
                </Link>
                
            </div>
            <div className = "footer-item link">
                <Link href = "/">
                    <Button className='link' variant="link">
                        <Linkedin/>
                        LinkedIn
                    </Button>
                </Link>
            </div>
        </header>
    );
}
