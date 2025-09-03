'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button"

export default function MainHomePage()
{
    return (
        <div className = "home-container">
            <div className = "home-item" id = "info">
                <div id = "info-card" className  = "card">
                    <div id = "info-card-title" className = "card-title">
                        AIOHospital
                    </div>
                    <div className = "card-content">
                        <Image className = "card-img" src = "/images/box-seam-fill.svg" alt = {"Caja"} height = {225} width={225} />
                        <div className = "card-subtitle">
                            Solución de gestión de recursos
                        </div>
                        <div className = "card-text">
                            Sistema informático para la administración
                            del <br/> <span id = "name">Hospital Padre Hurtado. </span> <br/>
                             Gestión y análisis de uso de espacios físicos con el
                            objetivo de conocer el estado actual, pasado y futuro de
                            los elementos del hospital.
                        </div>
                    </div>
                </div>
            </div>
            <div className = "home-item" id = "login">
                <div className  = "card">
                    <div id = "login-card-title" className = "card-title">
                        Bienvenido/a!
                    </div>
                    <div className = "card-content">
                        <Button id = "login-button">
                            <Link href="/login">Iniciar Sesión</Link>
                        </Button>
                        <Button id = "query-button">
                            <Link href="/login">Consultar</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}