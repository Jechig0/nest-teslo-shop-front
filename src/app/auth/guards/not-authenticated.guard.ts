import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

//Con este guard protegemos las rutas de login, si el uusario ya está autenticado,
//Se le redirecciona a la página principal al intentar acceder a la página de login
//Método asíncrono para poder usar el await
export const NotAuthenticatedGuard: CanMatchFn = async(
    route: Route,
    segments: UrlSegment[]
) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    const isAuthenticated = await firstValueFrom(authService.checkStatus())

    if (isAuthenticated){
        router.navigateByUrl('/')
        return false

    }

    return true;
}