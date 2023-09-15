import { Component, inject } from '@angular/core';
import { collection, Firestore, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private firestore: Firestore) {
    this.getData();
  }
  userData!: Observable<any>;
  private authService = inject(AuthService);
  private _router = inject(Router);

  async logOut(): Promise<void> {
    try {
      await this.authService.logOut();
      this._router.navigateByUrl('/auth/login');
    } catch (error) {
      console.log(error);
    }
  }

  getData() {
    const collectionInstance = collection(this.firestore, 'users');
    collectionData(collectionInstance).subscribe((value) => {
      {
        console.log(value);
      }
    });
    this.userData = collectionData(collectionInstance);
  }
}
