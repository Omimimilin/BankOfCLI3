import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Api } from './api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(Api).token();
    if (!token) {
        return next(req);
    }

    return next(
        req.clone({
            setHeaders: { Authorization: `Bearer ${token}`},
        }),
    );
};