import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const publicGuard: CanActivateFn = (route, state) => {
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) return true;

    const sessionStart = localStorage.getItem('sessionStart');
    if (sessionStart) {
        const now = new Date().getTime();
        const elapsed = now - parseInt(sessionStart, 10);
        if (elapsed < 10 * 60 * 1000) {
        // Si hay sesión activa, redirige al portal
        window.location.href = '/portal/inicio';
        return false;
        }
    }

    // No hay sesión, permite acceso a rutas publicas
    return true;
};