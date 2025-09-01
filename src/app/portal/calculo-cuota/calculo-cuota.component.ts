declare var swal: any;

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculo-cuota',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './calculo-cuota.component.html',
  styleUrl: './calculo-cuota.component.css'
})
export class CalculoCuotaComponent implements OnInit {
  tasas: any[] = [];
  tasa: string = '';
  cuotaCalculada: number | null = null;

  formData = {
    monto: null as number | null,
    //tasa: null as number | null,
    plazo: null as number | null
  };
  
  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.cargarTasas();
  }

  cargarTasas() {
    this.http.get<any[]>('http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=obtenerinteresapp')
      .subscribe({
        next: (data) => {
          this.tasas = data;
        },
        error: (err) => {
          console.error('Error al cargar tasas', err);
        }
      });
  }

  calcular() {
    if (this.formData.monto !== null && this.tasa !== null && this.formData.plazo !== null) {
      const monto = this.formData.monto.toFixed(2);
      const plazo = this.formData.plazo;
      const tasa = this.tasa;
  
      const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=calculocuota&monto=${monto}&tasa=${tasa}&plazo=${plazo}`;
  
      this.http.get(url, { responseType: 'text' }).subscribe({
        next: (res) => {
          // Respuesta: "143,10 €" -> limpiamos y convertimos a número
          let valorLimpio = res.replace(/[^\d,.-]/g, ''); // elimina todo excepto dígitos, coma, punto y guión
          valorLimpio = valorLimpio.replace(',', '.');     // cambia la coma por punto
          this.cuotaCalculada = parseFloat(valorLimpio);
        },
        error: (err) => {
          console.error(err);
          swal("Error!", "No se pudo calcular la cuota, intente de nuevo.", {
            icon: "error",
            buttons: { confirm: { className: "btn btn-danger" } }
          });
        }
      });
    } else {
      swal("Atención!", "Por favor complete todos los campos del formulario.", {
        icon: "warning",
        buttons: { confirm: { className: "btn btn-warning" } }
      });
    }
  }
  
}


