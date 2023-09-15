import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Provider } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-button-providers',
  templateUrl: './button-providers.component.html',
  styleUrls: ['./button-providers.component.css'],
})
export class ButtonProvidersComponent {
  @Input() isLogin = true;

  private _authService = inject(AuthService);
  private _router = inject(Router);

  providerAction(provider: Provider): void {
    if (provider === 'google') {
      this.signUpWithGoogle();
    }
  }

  async signUpWithGoogle(): Promise<void> {
    try {
      const result = await this._authService.signInWithGoogleProvider();
      this._router.navigateByUrl('/');
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}
