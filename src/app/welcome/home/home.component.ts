// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.css'
// })
// export class HomeComponent {

// }

// import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { ScriptLoaderService } from '../../services/script-loader.service';


// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements AfterViewInit {

//   constructor(
//     private scriptLoader: ScriptLoaderService,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

//   ngAfterViewInit(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       this.scriptLoader.loadScripts([
//         '/assets/plantilla-welcome/lib/jquery/jquery-3.6.0.min.js',
//         '/assets/plantilla-welcome/lib/bootstrap/bootstrap.bundle.min.js',
//         '/assets/plantilla-welcome/lib/wow/wow.min.js',
//         '/assets/plantilla-welcome/lib/easing/easing.min.js',
//         '/assets/plantilla-welcome/lib/waypoints/waypoints.min.js',
//         '/assets/plantilla-welcome/lib/counterup/counterup.min.js',
//         '/assets/plantilla-welcome/lib/owlcarousel/owl.carousel.min.js',
//         '/assets/plantilla-welcome/lib/lightbox/js/lightbox.min.js',
//         '/assets/plantilla-welcome/js/main.js'
//       ]).catch(err => console.error('Error cargando scripts:', err));
//     }
//   }
// }

// import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { ScriptLoaderService } from '../../services/script-loader.service';

// declare var $: any; // Para usar jQuery sin errores en TypeScript

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements AfterViewInit {

//   constructor(
//     private scriptLoader: ScriptLoaderService,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

//   ngAfterViewInit(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       this.scriptLoader.loadScripts([
//         '/assets/plantilla-welcome/lib/owlcarousel/owl.carousel.min.js'
//       ]).then(() => {
//         this.initOwlCarousel();
//       }).catch(err => console.error('Error cargando owl.carousel:', err));
//     }
//   }

//   private initOwlCarousel(): void {
//     $('.owl-carousel').owlCarousel({
//       loop: true,
//       margin: 10,
//       nav: true,
//       items: 1,
//       autoplay: true,
//       autoplayTimeout: 3000,
//       autoplayHoverPause: true
//       // agrega otras opciones que necesites
//     });
//   }
// }
// imports: [
//   RouterLink,
//   RouterOutlet,
//   FormsModule,
//   CommonModule,
//   HttpClientModule
// ]

// import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { RouterLink } from '@angular/router';

// declare var $: any;

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [RouterLink],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements AfterViewInit {

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

//   ngAfterViewInit(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       // Esperar al DOM para asegurarse que el HTML del carrusel ya se cargó
//       setTimeout(() => {
//         this.initOwlCarousel();
//       }, 1000); // Puedes subir a 800 si aún no aparece
//     }
//   }

//   private initOwlCarousel(): void {
//     if (typeof $ !== 'undefined' && $('.owl-carousel').length > 0) {
//       $('.owl-carousel').owlCarousel({
//         loop: true,
//         margin: 10,
//         nav: true,
//         items: 1,
//         autoplay: true,
//         autoplayTimeout: 3000,
//         autoplayHoverPause: true
//       });
//     } else {
//       console.warn('Owl Carousel: No se encontró ningún elemento .owl-carousel');
//     }
//   }
// }

import { Component, AfterViewInit, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Inicializar cuando el DOM esté listo y al navegar de vuelta
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => {
          this.ngZone.runOutsideAngular(() => this.initOwlCarousel());
        });

      // Primera inicialización
      this.ngZone.runOutsideAngular(() => this.initOwlCarousel());
    }
  }

  private initOwlCarousel(): void {
    if (typeof $ !== 'undefined' && $('.owl-carousel').length > 0) {
      const $carousel = $('.owl-carousel');
      if ($carousel.hasClass('owl-loaded')) {
        $carousel.trigger('destroy.owl.carousel');
        $carousel.removeClass('owl-loaded');
        $carousel.find('.owl-stage-outer').children().unwrap();
      }
      $carousel.owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true
      });
    }
  }
}
