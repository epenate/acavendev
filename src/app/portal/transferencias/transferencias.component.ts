// import {
//   Component,
//   AfterViewInit,
//   OnInit,
//   Inject,
//   PLATFORM_ID,
//   ChangeDetectorRef
// } from '@angular/core';
// import { isPlatformBrowser, CommonModule } from '@angular/common';
// import { Router, RouterLink, RouterOutlet } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { ScriptLoaderService } from '../services/script-loader.service';

// @Component({
//   selector: 'app-welcome',
//   standalone: true,
//   imports: [
//     RouterLink,
//     RouterOutlet,
//     FormsModule,
//     CommonModule,
//     HttpClientModule
//   ],
//   templateUrl: './welcome.component.html',
//   styleUrls: ['./welcome.component.css'],
// })
// export class WelcomeComponent implements OnInit, AfterViewInit {
//   loadingResources = true;
//   loginData = {
//     dui: '',
//     password: ''
//   };
//   loading = false;
//   loginError: string = '';

//   constructor(
//     public scriptLoader: ScriptLoaderService,
//     @Inject(PLATFORM_ID) public platformId: Object,
//     private cd: ChangeDetectorRef,
//     public router: Router,
//     private http: HttpClient
//   ) {}

//   obtenerCodigoAsociado(dui: string): void {
//     const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=obtenernombrepordui&dui=${dui}`;
//     this.http.get<any[]>(url).subscribe({
//       next: (data) => {
//         const codigo = data?.[0]?.codigo;
//         if (codigo) {
//           localStorage.setItem('nombre_asociado', data?.[0]?.nombre);
//         }
//       },
//       error: (err) => console.error('Error al obtener código:', err)
//     });
//   }
// }

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var swal: any;
declare var bootstrap: any;
type TipoCuenta = "Ahorros" | "Préstamos" | "Certificados a Plazo" | "Aportaciones";

interface Cuenta {
  Tipo: string;
  Codigo: string;
  Fech_Ult: string;
  Saldo: number;
  FechaTexto: string;
}

@Component({
  selector: 'app-transferencias',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './transferencias.component.html',
  styleUrls: ['./transferencias.component.css']
})
export class TransferenciasComponent {

  cuentaOrigen: string = ''
  cuentaOrigenCodigo: string = ''
  cuentaDestino: string = ''
  cuentaDestinoCodigo: string = ''
  cuentasDestino: { texto: string; codigo: string }[] = [];
  tipoCtaDestinoTexto: string = ''
  cuentas: Cuenta[] = [];
  concepto: string = '';
  monto: number = 0;
  passwordUsuario: string = '';
  mensajePassword: string = '';
  modalInstance: any;
  codigoAsociado: string = '';

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    public router: Router,
    private http: HttpClient
  ) {}

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
          this.obtenerDetalleCuentas(codigo);
        }
      },
      error: (err) => console.error('Error al obtener código:', err)
    });
  }

  obtenerDetalleCuentas(codigo: string): void {
    const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=obtenerdetallecuentas&codigo=${codigo}`;
  
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        if (!Array.isArray(data)) return;
  
        // Helpers para comparar tipos sin problemas de acentos
        const normaliza = (s: string) =>
          (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  
        const isAhorros      = (t: string) => normaliza(t) === 'ahorros';
        const isPrestamos    = (t: string) => normaliza(t) === 'prestamos';
        const isCertificados = (t: string) =>
          normaliza(t) === 'certificados a plazo' || normaliza(t).includes('certificado');
        const isAportaciones = (t: string) => normaliza(t) === 'aportaciones';
  
        // Formateo: Aportaciones => últimos 2, demás => últimos 4
        const formatoTexto = (c: any): string => {
          const sufijo = isAportaciones(c.Tipo)
            ? c.Codigo?.slice(-2)
            : c.Codigo?.slice(-4);
  
          const saldo = typeof c.Saldo === 'number' ? c.Saldo : Number(c.Saldo || 0);
  
          return `${c.Tipo} ${sufijo} (Saldo: $${saldo.toFixed(2)})`;
        };
  
        // 1) Origen: Ahorros que termine en 3101
        const origen = data.find(
          (c) => isAhorros(c.Tipo) && String(c.Codigo).endsWith('3101')
        );
  
        if (origen) {
          this.cuentaOrigenCodigo = origen.Codigo;
          this.cuentaOrigen = formatoTexto(origen);
        } else {
          // Fallback: primer Ahorros si no existe 3101
          const alt = data.find((c) => isAhorros(c.Tipo));
          if (alt) {
            this.cuentaOrigenCodigo = alt.Codigo;
            this.cuentaOrigen = formatoTexto(alt);
          } else {
            this.cuentaOrigenCodigo = '';
            this.cuentaOrigen = '';
          }
        }
  
        // 2) Destinos: Préstamos, Ahorros distintos al origen y Aportaciones
        this.cuentasDestino = data
          .filter(
            (c) =>
              !isCertificados(c.Tipo) && // excluir certificados
              (isPrestamos(c.Tipo) || isAhorros(c.Tipo) || isAportaciones(c.Tipo)) &&
              c.Codigo !== this.cuentaOrigenCodigo // evitar que se repita la de origen
          )
          .map((c) => ({
            codigo: c.Codigo,
            texto: formatoTexto(c),
          }));
      },
      error: (err) => console.error('Error al obtener detalle cuentas:', err),
    });
  }
  
  validarDatosTransferencia() {
    // Validamos que haya cuenta destino seleccionada
    if (!this.cuentaDestinoCodigo) {
      this.mostrarMensaje("Atención!", "debe seleccionar una cuenta destino", "warning");
      return;
    }
  
    // Validamos que concepto no esté vacío
    if (!this.concepto || this.concepto.trim() === '') {
      this.mostrarMensaje("Atencion!", "debe ingresar el concepto", "warning");
      return;
    }
  
    // Validamos que monto sea un número positivo
    if (this.monto === null || this.monto <= 0) {
      this.mostrarMensaje("Atención!", "debe ingresar un monto válido mayor a 0'", "warning");
      return;
    }
  
    // Si pasa todas las validaciones, mostramos los datos
    // console.log('Datos validados correctamente:');
    // console.log('Cuenta Origen:', this.cuentaOrigen);
    // console.log('Cuenta Origen Código:', this.cuentaOrigenCodigo);
    // console.log('Cuenta Destino:', this.cuentaDestinoCodigo);
    // console.log('Concepto:', this.concepto);
    // console.log('Monto:', this.monto.toFixed(2));
    const cuentaDest = this.cuentasDestino.find(c => c.codigo === this.cuentaDestinoCodigo);
    if (!cuentaDest) {
      this.mostrarMensaje('Error', 'No se encontró la cuenta destino', 'error');
      return;
    }
    
    this.tipoCtaDestinoTexto = cuentaDest.texto.split(' ')[0]
    this.abrirModalConfirmacion();
  }  

  crearTransferencia() {
    const tipoCtaOrg = 1;
  
    const cuentaDest = this.cuentasDestino.find(c => c.codigo === this.cuentaDestinoCodigo);
    if (!cuentaDest) {
      this.mostrarMensaje('Error', 'No se encontró la cuenta destino', 'error');
      return;
    }
  
    const tipoCtaDes = this.getTipoCuentaNumero(cuentaDest.texto);
    const now = new Date();
    const fechatransferencia = this.formatoFecha(now);
    const fechahoraop = this.formatoFecha(now);
    const usuario = localStorage.getItem('usuarioId') || '';
  
    const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=transferencia` +
      `&codOrg=${this.cuentaOrigenCodigo}` +
      `&codDest=${this.cuentaDestinoCodigo}` +
      `&tipoCtaOrg=${tipoCtaOrg}` +
      `&tipoCtaDes=${tipoCtaDes}` +
      `&valor=${this.monto.toFixed(2)}` +
      `&fechatransferencia=${fechatransferencia}` +
      `&Usuario=${usuario}` +
      `&fechahoraop=${fechahoraop}` +
      `&concepto=${encodeURIComponent(this.concepto)}` +
      `&nComprob=0`;
  
    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (resp) => {
        if (resp.includes('Transferencia realizada')) {
          swal({
            title: 'Éxito',
            text: 'La transferencia se realizó correctamente',
            icon: 'success',
            buttons: { confirm: { className: 'btn btn-success' } }
          }).then(() => {
            // Redirige al cerrar el swal
            window.location.href = '/portal/inicio';
          });
        } else {
          this.mostrarMensaje('Error', `Error en la transferencia: ${resp}`, 'error');
        }
      },
      error: (err) => {
        console.error('Error al crear transferencia:', err);
        this.mostrarMensaje('Error', 'No se pudo realizar la transferencia', 'error');
      }
    });
  }
  
  abrirModalConfirmacion() {
    const modalElement = document.getElementById('confirmTransferModal');
    if (modalElement) {
      // modal bloqueante: backdrop 'static' y teclado false
      this.modalInstance = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
      this.mensajePassword = '';
      this.passwordUsuario = '';
      this.modalInstance.show();
    }
  }
  
  // Cerrar modal desde botón Cancelar
  cerrarModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
  
  // Validar password
  validarPassword() {
    const dui = localStorage.getItem('dui');
    
    if (!this.passwordUsuario || this.passwordUsuario.trim() === '') {
      this.mensajePassword = 'Debe ingresar su contraseña';
      return;
    }
  
    if (!dui) {
      this.mensajePassword = 'No se pudo obtener el DUI del usuario';
      return;
    }
  
    const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=obtUsuarioMaeasoc&dui=${dui}&clave=${this.passwordUsuario}`;
  
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        if (!Array.isArray(data) || data.length === 0) {
          this.mensajePassword = 'Contraseña incorrecta';
        } else {
          // Password correcta
          // Guardamos el código del asociado
          this.codigoAsociado = data[0].codigo;
          this.mensajePassword = '';

          //Cerrar modal y crear transferencia
          this.crearTransferencia();
          this.cerrarModal();
        }
      },
      error: (err) => {
        console.error('Error al validar contraseña:', err);
        this.mensajePassword = 'Error al validar contraseña';
      }
    });
  }
  
  getTipoCuentaNumero(texto: string): number {
    const t = texto.split(' ')[0].toLowerCase();
    switch(t) {
      case 'prestamos': return 2;
      case 'ahorros': return 1;
      case 'aportaciones': return 3;
      case 'certificados': return 4;
      default: return 0;
    }
  }
  
  // Formatear fecha YYYY-MM-DD HH:mm:ss
  formatoFecha(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  private mostrarMensaje(titulo: string, texto?: string, tipo: "success" | "error" | "warning" = "success") {
    swal(titulo, texto, {
      icon: tipo,
      buttons: { confirm: { className: this.getClassBoton(tipo) } }
    });
  }

  // Retorna la clase de botón según el tipo de alerta
  private getClassBoton(tipo: string): string {
    switch(tipo) {
      case "success": return "btn btn-success";
      case "error": return "btn btn-danger";
      case "warning": return "btn btn-warning";
      default: return "btn btn-primary";
    }
  }
}


