import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
declare var bootstrap: any;

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  cuentas: any[] = [];
  nombre_asociado: string | null = null;
  primer_nombre: string | null = null;
  cuentaSeleccionada: any = null;
  tablaMovimientos: SafeHtml = '';
  filtro = { desde: '', hasta: '', ultimos: 30 };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Esto solo se ejecuta en el navegador
      const dui = localStorage.getItem('dui');
      if (dui) {
        this.obtenerCodigoAsociado(dui);
      } else {
        this.router.navigate(['/welcome']);
      }
    }
  }

  obtenerCodigoAsociado(dui: string): void {
    const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=obtenernombrepordui&dui=${dui}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        const codigo = data?.[0]?.codigo;
        if (codigo) {
          this.nombre_asociado = localStorage.getItem('nombre_asociado');
          this.primer_nombre = this.nombre_asociado?.split(' ')[0] || '';
          this.consultarCuentasAsociado(codigo);
        }
      },
      error: (err) => console.error('Error al obtener código:', err)
    });
  }

  consultarCuentasAsociado(codigo: string): void {
    const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=obtenerdetallecuentas&codigo=${codigo}`;
    
    this.http.get<any[]>(url).subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas;
      },
      error: (err) => console.error('Error al obtener cuentas:', err)
    });
  }

  verMovimientos(cuenta: string){

  }

  abrirModalMovimientos(cuenta: any) {
    this.cuentaSeleccionada = cuenta;

    // Configurar fechas por defecto
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    this.filtro.desde = `${año}-01-01`;
    this.filtro.hasta = `${año}-${mes}-${dia}`;
    this.filtro.ultimos = 30;

    this.consultarMovimientos();

    const modal = new bootstrap.Modal(document.getElementById('modalMovimientos'));
    modal.show();
  }

  tipoToNumero(tipo: string): number {
    switch (tipo) {
      case 'Prestamos': return 1;
      case 'Ahorros': return 2;
      case 'Aportaciones': return 3;
      case 'Certificados a Plazo': return 4;
      default: return 0;
    }
  }

  consultarMovimientos() {
    if (!this.cuentaSeleccionada) return;

    const tipoNum = this.tipoToNumero(this.cuentaSeleccionada.Tipo);
    const desde = this.filtro.desde.replace(/-/g, '-');
    const hasta = this.filtro.hasta.replace(/-/g, '-');
    const ultimos = this.filtro.ultimos;
    const codigo = this.cuentaSeleccionada.Codigo;

    const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=obtenermovimientos2&tipo=${tipoNum}&cuenta=${codigo}&desde=${desde}&hasta=${hasta}&ultimos=${ultimos}`;

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (html) => {
        html = html.replace(
          '<table',
          '<table class="table-bordered table-head-bg-info table-bordered-bd-black"'
        );
    
        // 2️⃣ Cambiar color del encabezado y corregir nombre
        // html = html.replace(
        //   /<th style='background-color:black;color:white' ><b>Fecha<\/b><\/th>/,
        //   "<th style='background-color:#17a2b8;color:white'><b>Fecha</b></th>"
        // );
    
        // html = html.replace(
        //   /<th style='background-color:black;color:white' ><b>Comprobant<\/b><\/th>/,
        //   "<th style='background-color:#17a2b8;color:white'><b>Comprobante</b></th>"
        // );
        this.tablaMovimientos = this.sanitizer.bypassSecurityTrustHtml(html);
      },
      error: (err) => {
        console.error('Error al obtener movimientos', err);
        this.tablaMovimientos = '<p class="text-danger">Error al cargar los movimientos.</p>';
      }
    });
  }

  getIconClass(tipo: string): string {
    switch (tipo) {
      case 'Aportaciones':
        return 'icon-primary';
      case 'Ahorros':
        return 'icon-secondary';
      case 'Prestamos':
        return 'icon-warning';
      case 'Certificados a Plazo':
        return 'icon-success';
      default:
        return 'icon-secondary';
    }
  }
  
}
