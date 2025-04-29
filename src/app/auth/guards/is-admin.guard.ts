import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, of } from 'rxjs';


//Este guard evita quue el usuario acceda a rutas de admin si no es admin
export const IsAdminGuard: CanMatchFn = async(
    route: Route,
    segments: UrlSegment[]
) => {

    const authService = inject(AuthService)
    
    await firstValueFrom(of(authService.checkStatus()))

    return authService.isAdmin()
}