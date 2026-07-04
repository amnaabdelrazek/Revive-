import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { UserProfile } from './features/user-profile/user-profile';
import { VerifyComponent } from './features/verify/verify.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'verify', component: VerifyComponent, canActivate: [NoAuthGuard] },
  { path: 'user-profile', component: UserProfile },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
