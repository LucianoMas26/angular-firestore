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
  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  hide = true;
  placeholderEmail: string = 'Correo';
  placeholderPassword: string = 'Contraseña';
  placeholderName: string = 'Nombre';
  placeholderLastname: string = 'Apellido';
  formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });

  async signUp(): Promise<void> {
    if (this.form.invalid) {
      this.updatePlaceholders();
      return;
    }
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
        this.addData(this.form.value);
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
        console.log('Data Saved Successfully');
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  updatePlaceholders(): void {
    this.placeholderEmail = this.form.get('email')?.hasError('required')
      ? 'Correo es obligatorio'
      : 'Correo';
    this.placeholderPassword = this.form.get('password')?.hasError('required')
      ? 'Contraseña es obligatoria'
      : 'Contraseña';
    this.placeholderName =
      this.form.get('name')?.hasError('required') &&
      this.form.get('name')?.touched
        ? 'Nombre es obligatorio'
        : 'Nombre';
    this.placeholderLastname =
      this.form.get('lastName')?.hasError('required') &&
      this.form.get('lastName')?.touched
        ? 'Apellido es obligatorio'
        : 'Apellido';
  }
}
