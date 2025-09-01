import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);

  // Si no estamos en el navegador, permitimos activación para que no rompa SSR
  if (!isPlatformBrowser(platformId)) return true;

  const sessionStart = localStorage.getItem('sessionStart');
  if (sessionStart) {
    const now = new Date().getTime();
    const elapsed = now - parseInt(sessionStart, 10);
    if (elapsed < 10 * 60 * 1000) {
      // Sesión válida
      return true;
    }
  }

  // Si no hay sesión o está vencida
  window.location.href = '/welcome/home';
  return false;
};