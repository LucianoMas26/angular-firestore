import { Component, inject } from '@angular/core';
import { SignUpForm } from 'src/app/models/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Credential } from 'src/app/models/models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private firestore: Firestore) {}
  hide = true;

  formBuilder = inject(FormBuilder);

  form: FormGroup<SignUpForm> = this.formBuilder.group({
    name: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    lastName: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: this.formBuilder.control('', {
      validators: Validators.required,
      nonNullable: true,
    }),
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
      const snackBarRef = this.openSnackBar();
      snackBarRef.afterDismissed().subscribe(() => {
        this._router.navigateByUrl('/');
      });
    } catch (error) {
      console.log(error);
    }
    console.log(this.form.value);
  }
  openSnackBar() {
    return this._snackBar.open('Succesfully Log in', 'Close', {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }

  addData(form: any) {
    const collectionInstance = collection(this.firestore, 'users');
    addDoc(collectionInstance, form.value)
      .then(() => {
        console.log('Data Saved Succesfully');
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
}
