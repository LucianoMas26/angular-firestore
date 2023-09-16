import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard, publicGuard } from './guards/login.guard';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ListComponent } from './components/list/list.component';
import { UpdateComponent } from './components/update/update.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ListComponent },
      { path: 'add-user', component: AddUserComponent },
      { path: 'update/:userId', component: UpdateComponent },
    ],
  },
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
