import { Component } from '@angular/core';
import { collection, Firestore, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  getData() {
    const collectionInstance = collection(this.firestore, 'users');
    collectionData(collectionInstance, { idField: 'id' }).subscribe((value) => {
      {
        console.log(value);
      }
    });
    this.userData = collectionData(collectionInstance, { idField: 'id' });
  }
}
