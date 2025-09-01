// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-authentication',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './authentication.component.html',
//   styleUrls: ['./authentication.component.css']
// })
// export class AuthenticationComponent implements OnInit {
//   loginData: { username: string; password: string } | undefined;

//   constructor(
//     private router: Router,
//     private http: HttpClient
//   ) {}

  // ngOnInit(): void {
  //   const navigation = this.router.getCurrentNavigation();
  //   this.loginData = navigation?.extras?.state as { username: string; password: string };

  //   if (!this.loginData) {
  //     this.router.navigate(['/welcome']);
  //     return;
  //   }

  //   const dui = this.loginData.username;
  //   const codigo = this.loginData.password;

  //   const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=validarusuario&dui=${dui}&codigo=${codigo}`;

  //   this.http.get(url, { responseType: 'text' }).subscribe({
  //     next: (response) => {
  //       const resultado = response.trim().toLowerCase();
  //       if (resultado === 'aprobado') {
  //         this.router.navigate(['/portal/home']);
  //       } else {
  //         alert('Usuario o contraseña incorrectos');
  //         this.router.navigate(['/welcome']);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error al validar usuario:', err);
  //       alert('Error de conexión con el servidor');
  //       this.router.navigate(['/welcome']);
  //     }
  //   });
  // }

  //ESTA VERSION SI FUNCIONABA
  // ngOnInit(): void {
  //   const state = this.router.getCurrentNavigation()?.extras?.state || history.state;
  //   this.loginData = state?.loginData;
  
  //   console.log('loginData recibido en authentication:', this.loginData);
  
  //   if (!this.loginData) {
  //     this.router.navigate(['/welcome/home']);
  //     return;
  //   }
  
  //   const dui = this.loginData.username;
  //   const codigo = this.loginData.password;
  
  //   const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=validarusuario&dui=${dui}&codigo=${codigo}`;
  
  //   this.http.get(url, { responseType: 'text' }).subscribe({
  //     next: (response) => {
  //       const resultado = response.trim().toLowerCase();
  //       if (resultado === 'aprobado') {
  //         this.router.navigate(['/portal/inicio']);
  //       } else {
  //         alert('Usuario o contraseña incorrectos');
  //         this.router.navigate(['/welcome/home']);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error al validar usuario:', err);
  //       alert('Error de conexión con el servidor');
  //       this.router.navigate(['/welcome/home']);
  //     }
  //   });
  // }

  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { HttpClient, HttpClientModule } from '@angular/common/http';
  import { CommonModule } from '@angular/common';
  
  @Component({
    standalone: true,
    selector: 'app-authentication',
    imports: [CommonModule, HttpClientModule], // ✅ IMPORTANTE
    templateUrl: './authentication.component.html'
  })
  export class AuthenticationComponent implements OnInit {
    loginData: any;
    loading = false;
  
    constructor(private router: Router, private http: HttpClient) {}
  
    ngOnInit(): void {
      const state = this.router.getCurrentNavigation()?.extras?.state || history.state;
      this.loginData = state?.loginData;
  
      if (!this.loginData) {
        this.router.navigate(['/welcome']);
        return;
      }
  
      const dui = this.loginData.username;
      const codigo = this.loginData.password;
      const url = `http://20.106.49.73:6059/ServicioAcavenApp?verif=scm02&q=validarusuario&dui=${dui}&codigo=${codigo}`;
  
      this.loading = true;
  
      this.http.get(url, { responseType: 'text' }).subscribe({
        next: (response) => {
          this.loading = false;
          const resultado = response.trim().toLowerCase();
          if (resultado === 'aprobado') {
            this.router.navigate(['/portal/inicio']);
          } else {
            alert('Usuario o contraseña incorrectos');
            window.location.href = '/welcome/home'; // 🔄 redirige de forma forzada
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error al validar usuario:', err);
          alert('Error de conexión con el servidor');
          window.location.href = '/welcome/home'; // 🔄 redirige de forma forzada
        }
      });      
    }
  }
  
