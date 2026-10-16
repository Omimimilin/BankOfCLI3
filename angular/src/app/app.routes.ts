import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Docs } from './pages/docs/docs';
import { LoginPage } from './pages/login-page/login-page';
import { NotFound } from './pages/not-found/not-found';
import { RegisterPage } from './pages/register-page/register-page';
import { TransactionPage } from './pages/transaction-page/transaction-page';
import { authGuard } from './service/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [authGuard({ reverse: true })],
  },
  {
    path: 'register',
    component: RegisterPage,
    canActivate: [authGuard({ reverse: true })],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard({ reverse: false })],
  },
  {
    path: 'transactions/:kind',
    component: TransactionPage,
    canActivate: [authGuard({ reverse: false })],
  },
  { path: 'docs', component: Docs },
  { path: 'not-found', component: NotFound },
  { path: '**', redirectTo: 'not-found' }, // must stay last
];
