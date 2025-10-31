// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   canActivate(): Observable<boolean> {
//     return of(this.authService.isAuthenticated()).pipe(
//       map(isAuthenticated => {
//         if (!isAuthenticated) {
//           // TODO: Redirect to login page
//           this.router.navigate(['/auth/login']);
//           return false;
//         }
//         return true;
//       })
//     );
//   }
// }