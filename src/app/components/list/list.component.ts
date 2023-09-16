import { Component, inject } from '@angular/core';
import {
  collection,
  Firestore,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  constructor(private firestore: Firestore) {
    this.getData();
  }
  userData!: Observable<any>;
  private authService = inject(AuthService);
  private _router = inject(Router);
  private userService = inject(UserService);

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
    collectionData(collectionInstance, { idField: 'id' }).subscribe((value) => {
      {
        console.log(value);
      }
    });
    this.userData = collectionData(collectionInstance, { idField: 'id' });
  }

  delete(id: string) {
    this.userService.deleteData(id);
  }
}
