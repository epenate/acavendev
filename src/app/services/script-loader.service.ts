// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//   providedIn: 'root'
// })
// export class ScriptLoaderService {
//   private loadedScripts: Set<string> = new Set();

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

//   // loadScripts(scripts: string[]): Promise<void> {
//   //   if (!isPlatformBrowser(this.platformId)) {
//   //     return Promise.resolve(); // No hacer nada en SSR
//   //   }

//   //   const promises = scripts.map(src => this.loadScript(src));
//   //   return Promise.all(promises).then(() => {});
//   // }

//   loadScripts(scripts: string[]): Promise<void> {
//     if (!isPlatformBrowser(this.platformId)) {
//       return Promise.resolve(); // No hacer nada en SSR
//     }
  
//     // Carga secuencial con reduce
//     return scripts.reduce(
//       (promiseChain, src) => promiseChain.then(() => this.loadScript(src)),
//       Promise.resolve()
//     );
//   }

//   private loadScript(src: string): Promise<void> {
//     return new Promise<void>((resolve, reject) => {
//       if (!isPlatformBrowser(this.platformId)) {
//         resolve();
//         return;
//       }

//       if (this.loadedScripts.has(src)) {
//         resolve(); // Ya cargado
//         return;
//       }

//       const script = document.createElement('script');
//       script.src = src;
//       script.defer = true;
//       script.onload = () => {
//         this.loadedScripts.add(src);
//         resolve();
//       };
//       script.onerror = () => reject(new Error(`Error cargando el script ${src}`));
//       document.body.appendChild(script);
//     });
//   }
// }

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private loadedScripts: Set<string> = new Set();
  private loadedStyles: Set<string> = new Set();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadScripts(scripts: string[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(); // No hacer nada en SSR
    }

    // Carga secuencial
    return scripts.reduce(
      (promiseChain, src) => promiseChain.then(() => this.loadScript(src)),
      Promise.resolve()
    );
  }

  private loadScript(src: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve();
        return;
      }

      if (this.loadedScripts.has(src)) {
        resolve(); // Ya cargado
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = () => {
        this.loadedScripts.add(src);
        resolve();
      };
      script.onerror = () => reject(new Error(`Error cargando el script ${src}`));
      document.body.appendChild(script);
    });
  }

  loadStyles(styles: string[]): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(); // No hacer nada en SSR
    }
  
    return styles.reduce(
      (promiseChain, href) => promiseChain.then(() => this.loadStyle(href)),
      Promise.resolve()
    );
  }
  
  private loadStyle(href: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.loadedScripts.has(href)) {
        resolve();
        return;
      }
  
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => {
        this.loadedScripts.add(href);
        resolve();
      };
      link.onerror = () => reject(new Error(`Error cargando el estilo ${href}`));
      document.head.appendChild(link);
    });
  }
  
}

