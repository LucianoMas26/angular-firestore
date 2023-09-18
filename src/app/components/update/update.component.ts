import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { doc, updateDoc, Firestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent {
  constructor(private firestore: Firestore, private route: ActivatedRoute) {}

  userService = inject(UserService);
  id: string | null = null;
  formBuilder = inject(FormBuilder);
  formValid = false;
  placeholderEmail: string = 'Correo';
  placeholderPassword: string = 'Contraseña';
  placeholderName: string = 'Nombre';
  placeholderLastname: string = 'Apellido';
  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });

  private getUserIdFromUrl(): string | null {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const id = urlParts[urlParts.length - 1];
    return id || null;
  }

  ngOnInit(): void {
    this.id = this.getUserIdFromUrl();
    if (this.id) {
      this.userService.getUserById(this.id).subscribe((userData) => {
        if (userData) {
          this.form.patchValue(userData);
        } else {
          console.error('Usuario no encontrado');
        }
      });
    }
    this.form.statusChanges.subscribe((status) => {
      this.formValid = status === 'VALID';
    });
  }

  updateData() {
    if (this.id) {
      const formValues = this.form.value;
      const docInstance = doc(this.firestore, 'users', this.id);
      const updateData = {
        name: formValues.name,
        lastName: formValues.lastName,
        email: formValues.email,
        password: formValues.password,
      };

      updateDoc(docInstance, updateData)
        .then(() => {
          Swal.fire(`Éxito!`, 'Has editado un usuario', 'success');
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Parece que algo salió mal!',
          });
          console.log(error.message);
        });
    } else {
      console.error('ID de usuario no válido');
    }
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
