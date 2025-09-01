import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, Output, PLATFORM_ID, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css'
})
export class MainHeaderComponent implements OnInit {
  primer_nombre: string = '';
  @Output() logout = new EventEmitter<void>();

  onLogoutClick() {
    this.logout.emit();
  }

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) public platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const nombreCompleto = localStorage.getItem('nombre_asociado');

      if (nombreCompleto) {
        const partes = nombreCompleto.split(' ');
        this.primer_nombre = this.capitalizar(partes[0] || '');
      } else {
        // Redirigir si no hay nombre almacenado
        this.router.navigate(['/welcome/home']);
      }
    }
  }

  private capitalizar(nombre: string): string {
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
  }


}
