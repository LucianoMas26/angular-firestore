import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private router: Router) {}
  login(email: string, password: string) {
    this.fireauth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        localStorage.setItem('token', 'true');
        this.router.navigate(['./dashboard']);
      })
      .catch((error) => {
        console.log(error.message);
        this.router.navigate(['/login']);
      });
  }

  register(email: string, password: string) {
    this.fireauth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('user created');
        this.router.navigate(['./login']);
      })
      .catch((error) => {
        console.log(error.message);
        this.router.navigate(['/register']);
      });
  }

  signOut() {
    this.fireauth
      .signOut()
      .then(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.log(error.message);
        this.router.navigate(['/login']);
      });
  }
}