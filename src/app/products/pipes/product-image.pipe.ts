import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
    name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
    transform(value: string | string[]| null): any {

        console.log({value})
        if (value === null) return `./assets/images/Image-not-found.png`;
        if (!value)  return `./assets/images/Image-not-found.png`;
        if (typeof value === 'string' && value.startsWith('blob:')) return value
        if (typeof value === 'string') return `${baseUrl}/files/product/${value}`;
        if (Array.isArray(value)) return `${baseUrl}/files/product/${value[0]}`;
    }
}