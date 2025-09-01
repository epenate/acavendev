import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initCounterUp();
      }, 500); // pequeño delay para asegurar que el DOM esté cargado
    }
  }

  private initCounterUp(): void {
    if (typeof $ !== 'undefined') {
      $('[data-toggle="counter-up"]').counterUp({
        delay: 20,
        time: 3000
      });
    }
  }
}
