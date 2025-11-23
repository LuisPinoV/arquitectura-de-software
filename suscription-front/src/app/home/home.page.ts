import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonImg,
  IonToggle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    NgFor,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonCol,
    IonRow,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonImg,
    IonToggle
  ],
})
export class HomePage {
  // JSON que define el contenido dinámico

  ngOnInit() {
  }
  clientes = [
    {
      nombre: 'COPEC',
      descripcion: 'Contento y Optimista pero Economicamente Cagado',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Copec_Logo.svg',
      Servicio1: true,
      Servicio2: false,
      Servicio3: true,
      Servicio4: false,
      Servicio5: true,
    },
    {
      nombre: 'Cencosud',
      descripcion: 'Cierto que En Normandia Culiaron Ortodoxos Sodomitas Unidos Por Dinamarca?.',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Cencosud_logo.svg/2560px-Cencosud_logo.svg.png',
      Servicio1: false,
      Servicio2: true,
      Servicio3: false,
      Servicio4: true,
      Servicio5: false,
    },
  ];
}
