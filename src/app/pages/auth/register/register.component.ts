import { Component, inject } from '@angular/core';
import { SignUpForm } from 'src/app/models/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Credential } from 'src/app/models/models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { UserForm } from 'src/app/models/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private firestore: Firestore) {}
  hide = true;

  formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  private authService = inject(AuthService);
  private _router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  async signUp(): Promise<void> {
    if (this.form.invalid) return;
    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };
    try {
      const userCredentials = await this.authService.signUpWithEmailAndPassword(
        credential
      );
      Swal.fire({
        icon: 'success',
        title: `Bienvenido/a ${this.form.value.name}`,
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        this._router.navigateByUrl('/');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que algo salió mal!',
      });
      console.log(error);
    }
  }

  addData(form: UserForm) {
    const collectionInstance = collection(this.firestore, 'users');
    addDoc(collectionInstance, form)
      .then(() => {
        console.log('Data Saved Succesfully');
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
}
