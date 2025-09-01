import { Component, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScriptLoaderService } from '../services/script-loader.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { FooterComponent } from './footer/footer.component';


@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule, CommonModule, SidebarComponent, MainHeaderComponent, FooterComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent implements OnInit, AfterViewInit {
  loadingResources = true;
  sessionInterval: any;
  warningShown = false;

  constructor(
    public scriptLoader: ScriptLoaderService,
    @Inject(PLATFORM_ID) public platformId: Object,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // ... verificación de sesión ...
  
      const start = localStorage.getItem('sessionStart');
      if (start) {
        const now = new Date().getTime();
        const elapsed = now - parseInt(start, 10);
        if (elapsed >= 10 * 60 * 1000) {
          this.cerrarSesion();
          return;
        }
      } else {
        this.cerrarSesion();
        return;
      }
  
      this.verificarSesionCadaSegundo();

      const styles = [
        '/assets/plantilla-portal/css/bootstrap.min.css',
        '/assets/plantilla-portal/css/plugins.css',
        '/assets/plantilla-portal/css/kaiadmin.min.css',
      ];
      this.scriptLoader.loadStyles(styles)
        .then(() => {
          // Si quieres esperar también a los scripts, marca stylesLoaded en ngAfterViewInit
          document.body.classList.add('styles-loaded'); // <-- mostrar contenido
        })
        .catch(err => {
          console.error('Error cargando estilos:', err);
          document.body.classList.add('styles-loaded'); // igual mostrar aunque falle
        });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scripts = [
        '/assets/plantilla-portal/js/core/jquery-3.7.1.min.js',
        '/assets/plantilla-portal/js/core/popper.min.js',
        '/assets/plantilla-portal/js/core/bootstrap.min.js',
        '/assets/plantilla-portal/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js',
        '/assets/plantilla-portal/js/plugin/chart.js/chart.min.js',
        '/assets/plantilla-portal/js/plugin/jquery.sparkline/jquery.sparkline.min.js',
        '/assets/plantilla-portal/js/plugin/chart-circle/circles.min.js',
        '/assets/plantilla-portal/js/plugin/datatables/datatables.min.js',
        '/assets/plantilla-portal/js/plugin/bootstrap-notify/bootstrap-notify.min.js',
        '/assets/plantilla-portal/js/plugin/jsvectormap/jsvectormap.min.js',
        '/assets/plantilla-portal/js/plugin/jsvectormap/world.js',
        '/assets/plantilla-portal/js/plugin/sweetalert/sweetalert.min.js',
        '/assets/plantilla-portal/js/kaiadmin.min.js',
      ];
      this.scriptLoader.loadScripts(scripts)
        .then(() => {
          this.loadingResources = false;
          document.body.classList.add('styles-loaded');
        })
        .catch(err => {
          console.error('Error cargando scripts:', err);
          this.loadingResources = false;
          document.body.classList.add('styles-loaded');
        });
    } else {
      this.loadingResources = false;
      // NO usar document aquí, porque no hay DOM en servidor
    }
  }
  
  verificarSesionCadaSegundo() {
    this.sessionInterval = setInterval(() => {
      const start = localStorage.getItem('sessionStart');
      if (start) {
        const startTime = parseInt(start, 10);
        const now = new Date().getTime();
        const elapsed = now - startTime;
  
        const maxDuration = 1 * 600 * 1000; // 10 minutos en ms
        const warningTime = maxDuration - 30 * 1000; // 30 segundos antes
  
        if (elapsed >= warningTime && !this.warningShown) {
          this.warningShown = true;
          this.mostrarAlertaExpiracion();
        }
  
        if (elapsed >= maxDuration) {
          this.cerrarSesion();
        }
      }
    }, 1000);
  }
  
  mostrarAlertaExpiracion() {
    let segundosRestantes = 30;
  
    // Mostrar el modal inicial
    (window as any).swal({
      title: "Sesión por expirar",
      text: `Tu sesión expirará en ${segundosRestantes} segundos. ¿Deseás extenderla?`,
      icon: "warning",
      buttons: {
        cancel: "Cerrar sesión",
        confirm: {
          text: "Refrescar sesión",
          value: true,
        },
      },
      dangerMode: true,
      closeOnClickOutside: false,
      closeOnEsc: false
    }).then((willRefresh: boolean) => {
      clearInterval(interval); // Para asegurarnos de parar el intervalo cuando cierren el modal
  
      if (willRefresh) {
        this.refrescarSesion();
      } else {
        this.cerrarSesion();
      }
    });
  
    // Cada segundo actualizamos el texto del modal
    const interval = setInterval(() => {
      segundosRestantes--;
  
      if (segundosRestantes > 0) {
        // Actualizamos el contenido del texto sin cerrar el modal
        const content = document.querySelector('.swal-text');
        if (content) {
          content.textContent = `Tu sesión expirará en ${segundosRestantes} segundos. ¿Deseás extenderla?`;
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
  
  refrescarSesion() {
    const now = new Date().getTime();
    localStorage.setItem('sessionStart', now.toString());
    this.warningShown = false;
  }
  
  cerrarSesion() {
    clearInterval(this.sessionInterval);
    localStorage.clear(); // o solo removeItem('dui') y 'sessionStart'
    window.location.href = 'welcome/home'; // o como se llame tu ruta de login
  }
}