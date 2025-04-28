import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaginationService {
    private activatedRoute = inject(ActivatedRoute)

  currentPage = toSignal(this.activatedRoute.queryParamMap.pipe(
    map((params) => (params.get('page') ? +params.get('page')! : 1) ), //Obtenemos el valor del queryParamMap y lo convertimos a número
    map(page => (isNaN(page) ? 1 : page) ), //Si añaden un valor no numérico manualmente, se asigna 1
  ),
  {initialValue: 1}  
)
}