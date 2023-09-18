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
  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
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
}
