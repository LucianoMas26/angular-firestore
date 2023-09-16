import { FormControl } from '@angular/forms';

export interface SignUpForm {
  name: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

export interface Credential {
  email: string;
  password: string;
}

export type Provider = 'google';

export interface User {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserForm {
  name: string;
  lastName: string;
  email: string;
  password: string;
}
