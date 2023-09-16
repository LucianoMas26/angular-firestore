import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { doc, updateDoc, Firestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent {
  constructor(private firestore: Firestore, private route: ActivatedRoute) {}

  formBuilder = inject(FormBuilder);
  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  updateData() {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const id = urlParts[urlParts.length - 1];
    const formValues = this.form.value;
    if (id) {
      const docInstance = doc(this.firestore, 'users', id);
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
    }
  }
}
