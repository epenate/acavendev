import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'acaven_web_application';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Ejecutar solo si estamos en navegador
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // Hacer scroll al inicio después de cada navegación
        window.scrollTo(0, 0);
      });

      // Manejar rutas no existentes redirigiendo a raíz
      this.router.errorHandler = (error: any) => {
        console.error(error);
        this.router.navigateByUrl('/');
      };
    }
  }
}
