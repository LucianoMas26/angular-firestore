import { Injectable, inject } from '@angular/core';
import {
  collection,
  Firestore,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  async deleteData(id: string, showConfirmation: boolean = true) {
    if (showConfirmation) {
      const result = await Swal.fire({
        title: 'Confirmar Eliminación',
        text: '¿Estás seguro de que deseas eliminar este usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (!result.isConfirmed) {
        return;
      }
    }
    const docInstance = doc(this.firestore, 'users', id);
    deleteDoc(docInstance)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario eliminado',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Parece que algo salió mal!',
        });
        console.log(error);
      });
  }

  getUserById(userId: string): Observable<any> {
    const docInstance = doc(this.firestore, 'users', userId);
    return new Observable((observer) => {
      getDoc(docInstance)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            observer.next(userData);
          } else {
            observer.next(null);
          }
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
