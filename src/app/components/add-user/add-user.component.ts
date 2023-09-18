import { Component, inject } from '@angular/core';
import { SignUpForm } from 'src/app/models/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { UserForm } from 'src/app/models/models';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  constructor(private firestore: Firestore) {}
  hide = true;
  formValid = false;
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

  ngOnInit() {
    this.form.statusChanges.subscribe((status) => {
      this.formValid = status === 'VALID';
    });
  }
  addData(form: UserForm) {
    const collectionInstance = collection(this.firestore, 'users');
    addDoc(collectionInstance, form)
      .then(() => {
        Swal.fire(`¡Éxito!`, 'Has agregado un nuevo usuario', 'success');
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Parece que algo salió mal!',
        });
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
