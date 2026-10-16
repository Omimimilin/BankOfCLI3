import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { authGuard } from './core/auth.guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { TransactionPage } from './pages/transaction/transaction';
import { History } from './pages/history/history';
export const routes: Routes = [
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'deposit', component: TransactionPage, canActivate: [authGuard], data: {kind: 'deposit'} },
    { path: 'withdraw', component: TransactionPage, canActivate: [authGuard], data: {kind: 'withdraw'} },
    { path: 'transfer', component: TransactionPage, canActivate: [authGuard], data: {kind: 'transfer'} },
    { path: 'history', component: History, canActivate: [authGuard]},
];


