import { Component, inject } from '@angular/core';
import { LoginForm } from 'src/app/models/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Credential } from 'src/app/models/models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hide = true;
  formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private _router = inject(Router);

  form: FormGroup<LoginForm> = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  async logIn(): Promise<void> {
    if (this.form.invalid) return;
    const credential: Credential = {
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    };

    try {
      await this.authService.loginWithEmailAndPassword(credential);
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido/a',
        showConfirmButton: false,
        timer: 1500,
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
}
