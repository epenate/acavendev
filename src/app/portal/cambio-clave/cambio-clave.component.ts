declare var swal: any;

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cambio-clave',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './cambio-clave.component.html',
  styleUrl: './cambio-clave.component.css'
})
export class CambioClaveComponent {

  claveAnterior: string = ''
  nuevaClave: string = ''
  confirmation: string = ''
  mostrarClave: boolean = false;

  mensaje: string = ''; // Para mostrar mensajes en el formulario
  mensajeError: boolean = false; // true = error, false = éxito

  constructor(private http: HttpClient) {}

  cambiarClave() {
    // 1. Validar que todos los campos estén llenos
    if (!this.claveAnterior || !this.nuevaClave || !this.confirmation) {
      this.mostrarMensaje("Atención!", "Por favor complete todos los campos del formulario.", "warning");
      return;
    }

    // 2. Validar que nuevaClave y confirmation coincidan
    if (this.nuevaClave !== this.confirmation) {
      this.mostrarMensaje("Error!", "La confirmación no coincide con la nueva clave.", "error");
      return;
    }

    // 3. Obtener DUI desde localStorage
    const dui = localStorage.getItem('dui');
    if (!dui) {
      this.mostrarMensaje("Error!", "No se encontró DUI en sesión.", "error");
      return;
    }

    // 4. Obtener código de cliente
    const urlCodigo = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=obtenernombrepordui&dui=${dui}`;
    this.http.get<any[]>(urlCodigo).subscribe({
      next: (data) => {
        const codigo = data?.[0]?.codigo;
        if (!codigo) {
          this.mostrarMensaje("Error!", "No se pudo obtener el código de cliente.", "error");
          return;
        }

        // 5. Llamar al endpoint para cambiar clave
        const urlCambio = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=modificarclave&codigo=${codigo}&pwdant=${this.claveAnterior}&nvapwd=${this.nuevaClave}`;
        
        this.http.get(urlCambio, { responseType: 'text' }).subscribe({
          next: (respuesta) => {
            if (respuesta.includes('Clave Cambiada con Exito!')) {
              this.mostrarMensaje("Éxito", "Clave cambiada con éxito.", "success");
              this.claveAnterior = '';
              this.nuevaClave = '';
              this.confirmation = '';
            } else {
              this.mostrarMensaje("Error!", respuesta, "error");
            }
          },
          error: () => {
            this.mostrarMensaje("Error!", "Error al cambiar la clave.", "error");
          }
        });

      },
      error: () => {
        this.mostrarMensaje("Error!", "Error al obtener código de cliente.", "error");
      }
    });
  }

  // Método único para mostrar alertas
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
