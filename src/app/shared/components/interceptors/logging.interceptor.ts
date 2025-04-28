import { HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export function loggingInterceptor
//El interceptor recibe la petición de cualquier tipo 
//y el siguiente proceso a ejecutar y devuelve un observable de cualquier tipo
(req: HttpRequest<unknown>, next: HttpHandlerFn)
: Observable<HttpEvent<unknown>> {
    return next(req).pipe(tap(event => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'returned a response with status', event.status);
      }
    }));
  }