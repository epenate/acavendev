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
// import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
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

//   // 🔧 Configurar la URL base según el ambiente
//   private readonly API_BASE_URL = 'http://20.106.49.73:6059/ServicioAcavenApp';

//   constructor(
//     public scriptLoader: ScriptLoaderService,
//     @Inject(PLATFORM_ID) public platformId: Object,
//     private cd: ChangeDetectorRef,
//     public router: Router,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       const styles = [
//         'https://use.fontawesome.com/releases/v5.15.4/css/all.css',
//         'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css',
//         '/assets/plantilla-welcome/css/bootstrap.min.css',
//         '/assets/plantilla-welcome/lib/animate/animate.min.css',
//         '/assets/plantilla-welcome/lib/owlcarousel/assets/owl.carousel.min.css',
//         '/assets/plantilla-welcome/lib/lightbox/css/lightbox.min.css',
//         '/assets/plantilla-welcome/css/style.css',
//       ];
//       this.scriptLoader.loadStyles(styles).catch(err => {
//         console.error('Error cargando estilos:', err);
//       });
//     }
//   }

//   ngAfterViewInit(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       const scripts = [
//         '/assets/plantilla-welcome/lib/jquery/jquery-3.6.0.min.js',
//         '/assets/plantilla-welcome/lib/bootstrap/bootstrap.bundle.min.js',
//         '/assets/plantilla-welcome/lib/wow/wow.min.js',
//         '/assets/plantilla-welcome/lib/easing/easing.min.js',
//         '/assets/plantilla-welcome/lib/waypoints/waypoints.min.js',
//         '/assets/plantilla-welcome/lib/counterup/counterup.min.js',
//         '/assets/plantilla-welcome/lib/owlcarousel/owl.carousel.min.js',
//         '/assets/plantilla-welcome/lib/lightbox/js/lightbox.min.js',
//         '/assets/plantilla-welcome/js/main.js'
//       ];
  
//       this.scriptLoader.loadScripts(scripts)
//         .then(() => {
//           setTimeout(() => {
//             this.loadingResources = false;
//           });
//         })
//         .catch(err => {
//           console.error('Error cargando scripts o estilos:', err);
//           setTimeout(() => {
//             this.loadingResources = false;
//           });
//         });
//     } else {
//       setTimeout(() => {
//         this.loadingResources = false;
//       });
//     }
//   }

//   irAAuthentication(dui: string, codigo: string): void {
//     this.loading = true;
//     this.loginError = '';

//     // 🔧 Log para debugging
//     // console.log('🔍 Intentando autenticar:', { dui, codigo });
//     // console.log('🔍 URL API:', this.API_BASE_URL);

//     const url = `${this.API_BASE_URL}?verif=scm02&q=validarusuario&dui=${dui}&codigo=${codigo}`;

//     // 🔧 Agregar headers y manejo de errores mejorado
//     const headers = {
//       'Content-Type': 'application/json',
//       'Accept': 'text/plain, */*'
//     };

//     this.http.get(url, { 
//       responseType: 'text',
//       headers: headers 
//     }).subscribe({
//       next: (response: string) => {
//         // console.log('✅ Respuesta del servidor:', response);
        
//         // if (response.toLowerCase().includes('aprobado')) {
//         //   console.log('✅ Login aprobado, guardando datos...');
          
//         //   // Guardar datos en localStorage
//         //   localStorage.setItem('dui', dui);
//         //   const now = new Date().getTime();
//         //   localStorage.setItem('sessionStart', now.toString());
          
//         //   // Obtener código asociado antes de navegar
//         //   this.obtenerCodigoAsociado(dui).then(() => {
//         //     console.log('✅ Navegando al portal...');
//         //     // 🔧 Usar router.navigate en lugar de window.location.href
//         //     this.router.navigate(['/portal/inicio']).then(success => {
//         //       if (success) {
//         //         console.log('✅ Navegación exitosa');
//         //       } else {
//         //         console.error('❌ Error en la navegación');
//         //         this.loginError = 'Error interno. Intenta nuevamente.';
//         //         this.loading = false;
//         //       }
//         //     }).catch(navError => {
//         //       console.error('❌ Error navegando:', navError);
//         //       this.loginError = 'Error interno. Intenta nuevamente.';
//         //       this.loading = false;
//         //     });
//         //   }).catch(() => {
//         //     // Si falla obtener código, aún así navegar
//         //     this.router.navigate(['/portal/inicio']);
//         //   });
          
//         // } else {
//         //   console.log('❌ Login denegado:', response);
//         //   this.loginError = 'Acceso denegado. Verifica tu DUI o contraseña.';
//         //   this.loading = false;
//         // }

//         if (response.toLowerCase().includes('aprobado')) {
//           // console.log('✅ Login aprobado, guardando datos...');
          
//           // Guardar datos en localStorage
//           localStorage.setItem('dui', dui);
//           const now = new Date().getTime();
//           localStorage.setItem('sessionStart', now.toString());
          
//           // Obtener código asociado antes de navegar
//           this.obtenerCodigoAsociado(dui).then(() => {
//             // console.log('✅ Navegando al portal...');
//             // Usar window.location.href para forzar recarga completa
//             window.location.href = '/portal/inicio';
//           }).catch(() => {
//             // Si falla obtener código, aún así navegar
//             window.location.href = '/portal/inicio';
//           });
          
//         } else {
//           // console.log('❌ Login denegado:', response);
//           this.loginError = 'Acceso denegado. Verifica tu DUI o contraseña.';
//           this.loading = false;
//         }
//       },
//       error: (error: HttpErrorResponse) => {
//         // console.error('❌ Error completo:', error);
//         // console.error('❌ Status:', error.status);
//         // console.error('❌ Message:', error.message);
//         // console.error('❌ Error object:', error.error);
        
//         // 🔧 Mensajes de error más específicos
//         if (error.status === 0) {
//           this.loginError = 'Error de conexión. Verifica tu conexión a internet o contacta al administrador.';
//         } else if (error.status >= 500) {
//           this.loginError = 'Error del servidor. Intenta nuevamente en unos minutos.';
//         } else if (error.status === 404) {
//           this.loginError = 'Servicio no disponible. Contacta al administrador.';
//         } else {
//           this.loginError = `Error de conexión (${error.status}). Intenta nuevamente.`;
//         }
        
//         this.loading = false;
//       }
//     });
//   }

//   // 🔧 Convertir a Promise para mejor manejo
//   obtenerCodigoAsociado(dui: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       const url = `${this.API_BASE_URL}?verif=scm02&q=obtenernombrepordui&dui=${dui}`;
      
//       this.http.get<any[]>(url).subscribe({
//         next: (data) => {
//           // console.log('✅ Datos asociado:', data);
//           const codigo = data?.[0]?.codigo;
//           if (codigo && data?.[0]?.nombre) {
//             localStorage.setItem('nombre_asociado', data[0].nombre);
//             localStorage.setItem('codigo_asociado', codigo);
//           }
//           resolve();
//         },
//         error: (err) => {
//           console.error('❌ Error al obtener código:', err);
//           reject(err);
//         }
//       });
//     });
//   }
// }

import {
  Component,
  AfterViewInit,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ScriptLoaderService } from '../services/script-loader.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  loadingResources = true;
  stylesLoaded = false;
  scriptsLoaded = false;
  
  loginData = {
    dui: '',
    password: ''
  };
  loading = false;
  loginError: string = '';

  private readonly API_BASE_URL = 'http://20.106.49.73:6059/ServicioAcavenApp';

  constructor(
    public scriptLoader: ScriptLoaderService,
    @Inject(PLATFORM_ID) public platformId: Object,
    private cd: ChangeDetectorRef,
    public router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 🔧 Cargar estilos INMEDIATAMENTE para evitar FOUC
      this.loadStylesEarly();
    } else {
      // En SSR, marcar como cargado inmediatamente
      this.loadingResources = false;
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo cargar scripts después de que los estilos estén listos
      this.loadScriptsAfterStyles();
    }
  }

  private loadStylesEarly(): void {
    const styles = [
      'https://use.fontawesome.com/releases/v5.15.4/css/all.css',
      'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css',
      '/assets/plantilla-welcome/css/bootstrap.min.css',
      '/assets/plantilla-welcome/lib/animate/animate.min.css',
      '/assets/plantilla-welcome/lib/owlcarousel/assets/owl.carousel.min.css',
      '/assets/plantilla-welcome/lib/lightbox/css/lightbox.min.css',
      '/assets/plantilla-welcome/css/style.css',
    ];
  
    this.scriptLoader.loadStyles(styles)
      .then(() => {
        console.log('✅ Estilos cargados');
        this.stylesLoaded = true;
        document.body.classList.add('styles-loaded'); // <- Muestra la app
        this.checkIfResourcesReady();
      })
      .catch(err => {
        console.error('Error cargando estilos:', err);
        this.stylesLoaded = true;
        document.body.classList.add('styles-loaded'); // <- Muestra igual aunque haya error
        this.checkIfResourcesReady();
      });
  }
  

  private loadScriptsAfterStyles(): void {
    // 🔧 Esperar un poco más para asegurar que los estilos estén aplicados
    const delay = this.stylesLoaded ? 100 : 500;
    
    setTimeout(() => {
      const scripts = [
        '/assets/plantilla-welcome/lib/jquery/jquery-3.6.0.min.js',
        '/assets/plantilla-welcome/lib/bootstrap/bootstrap.bundle.min.js',
        '/assets/plantilla-welcome/lib/wow/wow.min.js',
        '/assets/plantilla-welcome/lib/easing/easing.min.js',
        '/assets/plantilla-welcome/lib/waypoints/waypoints.min.js',
        '/assets/plantilla-welcome/lib/counterup/counterup.min.js',
        '/assets/plantilla-welcome/lib/owlcarousel/owl.carousel.min.js',
        '/assets/plantilla-welcome/lib/lightbox/js/lightbox.min.js',
        '/assets/plantilla-welcome/js/main.js'
      ];

      this.scriptLoader.loadScripts(scripts)
        .then(() => {
          console.log('✅ Scripts cargados');
          this.scriptsLoaded = true;
          this.checkIfResourcesReady();
          
          // 🔧 Inicializar carrusel específicamente
          this.initializeCarousel();
        })
        .catch(err => {
          console.error('Error cargando scripts:', err);
          this.scriptsLoaded = true;
          this.checkIfResourcesReady();
        });
    }, delay);
  }

  private checkIfResourcesReady(): void {
    if (this.stylesLoaded && this.scriptsLoaded) {
      // 🔧 Pequeño delay adicional para asegurar que todo esté renderizado
      setTimeout(() => {
        this.loadingResources = false;
        this.cd.detectChanges();
        console.log('✅ Todos los recursos cargados');
      }, 200);
    }
  }

  private initializeCarousel(): void {
    // 🔧 Inicializar carrusel manualmente si es necesario
    setTimeout(() => {
      if (typeof (window as any).$ !== 'undefined') {
        console.log('🎠 Inicializando carrusel...');
        
        // Reinicializar Owl Carousel si existe
        const $carousel = (window as any).$('.owl-carousel');
        if ($carousel.length > 0) {
          $carousel.trigger('destroy.owl.carousel');
          $carousel.removeClass('owl-loaded');
          $carousel.find('.owl-stage-outer').children().unwrap();
          
          // Reinicializar con configuración
          $carousel.owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            items: 1,
            dots: false,
            loop: true,
            nav: true,
            navText: [
              '<i class="bi bi-chevron-left"></i>',
              '<i class="bi bi-chevron-right"></i>'
            ]
          });
          
          console.log('✅ Carrusel inicializado');
        }
        
        // Inicializar otras animaciones
        this.initializeAnimations();
      }
    }, 300);
  }

  private initializeAnimations(): void {
    if (typeof (window as any).WOW !== 'undefined') {
      new (window as any).WOW().init();
      console.log('✅ Animaciones WOW inicializadas');
    }
  }

  // Resto de tus métodos permanecen igual
  irAAuthentication(dui: string, codigo: string): void {
    this.loading = true;
    this.loginError = '';

    const url = `${this.API_BASE_URL}?verif=scm02&q=validarusuario&dui=${dui}&codigo=${codigo}`;

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'text/plain, */*'
    };

    this.http.get(url, { 
      responseType: 'text',
      headers: headers 
    }).subscribe({
      next: (response: string) => {
        if (response.toLowerCase().includes('aprobado')) {
          localStorage.setItem('dui', dui);
          const now = new Date().getTime();
          localStorage.setItem('sessionStart', now.toString());
          
          this.obtenerCodigoAsociado(dui).then(() => {
            //this.router.parseUrl('/portal/inicio');
            window.location.href = '/portal/inicio';
          }).catch(() => {
            window.location.href = '/portal/inicio';
          });
          
        } else {
          this.loginError = 'Acceso denegado. Verifica tu DUI o contraseña.';
          this.loading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.loginError = 'Error de conexión. Verifica tu conexión a internet o contacta al administrador.';
        } else if (error.status >= 500) {
          this.loginError = 'Error del servidor. Intenta nuevamente en unos minutos.';
        } else if (error.status === 404) {
          this.loginError = 'Servicio no disponible. Contacta al administrador.';
        } else {
          this.loginError = `Error de conexión (${error.status}). Intenta nuevamente.`;
        }
        
        this.loading = false;
      }
    });
  }

  obtenerCodigoAsociado(dui: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `${this.API_BASE_URL}?verif=scm02&q=obtenernombrepordui&dui=${dui}`;
      
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          const codigo = data?.[0]?.codigo;
          if (codigo && data?.[0]?.nombre) {
            localStorage.setItem('nombre_asociado', data[0].nombre);
            localStorage.setItem('codigo_asociado', codigo);
          }
          resolve();
        },
        error: (err) => {
          console.error('❌ Error al obtener código:', err);
          reject(err);
        }
      });
    });
  }
}
