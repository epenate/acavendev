import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './welcome/home/home.component';
import { AboutComponent } from './welcome/about/about.component';
import { ServicesComponent } from './welcome/services/services.component';
import { ContactComponent } from './welcome/contact/contact.component';
import { FuncionariosComponent } from './welcome/funcionarios/funcionarios.component';
import { PrivacyPoliciesComponent } from './welcome/privacy-policies/privacy-policies.component';
import { RseComponent } from './welcome/rse/rse.component';
import { DocumentosComponent } from './welcome/documentos/documentos.component';
import { HistoryComponent } from './welcome/history/history.component';
import { ValoresComponent } from './welcome/valores/valores.component';
import { MisionVisionComponent } from './welcome/mision-vision/mision-vision.component';
import { SolicitudCreditoComponent } from './welcome/solicitud-credito/solicitud-credito.component';
import { RespaldoComponent } from './welcome/respaldo/respaldo.component';

import { PortalComponent } from './portal/portal.component';
import { InicioComponent } from './portal/inicio/inicio.component';
import { CalculoCuotaComponent } from './portal/calculo-cuota/calculo-cuota.component';
import { CambioClaveComponent } from './portal/cambio-clave/cambio-clave.component';
import { SolicitudCreditoAsociadosComponent } from './portal/solicitud-credito-asociados/solicitud-credito-asociados.component';
import { TransferenciasComponent } from './portal/transferencias/transferencias.component';

import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { AuthenticationComponent } from './authentication/authentication.component';

export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [publicGuard], // 🚫 Bloquea si hay sesión
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'funcionarios', component: FuncionariosComponent },
      { path: 'privacy-policies', component: PrivacyPoliciesComponent },
      { path: 'rse', component: RseComponent },
      { path: 'documentos', component: DocumentosComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'valores', component: ValoresComponent },
      { path: 'mision&vision', component: MisionVisionComponent },
      { path: 'solicitud-credito', component: SolicitudCreditoComponent },
      { path: 'respaldo', component: RespaldoComponent }
    ]
  },
  { path: 'authentication', component: AuthenticationComponent },

  {
    path: 'portal',
    component: PortalComponent,
    canActivate: [authGuard], // ✅ Solo accesible si hay sesión
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'calculo-cuota', component: CalculoCuotaComponent },
      { path: 'cambio-clave', component: CambioClaveComponent },
      { path: 'solicitud-credito-asociados', component: SolicitudCreditoAsociadosComponent },
      { path: 'transferencias', component: TransferenciasComponent }
    ]
  },

  // REDIRECCIONES GENERALES
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: '**', redirectTo: '/welcome' }
];
