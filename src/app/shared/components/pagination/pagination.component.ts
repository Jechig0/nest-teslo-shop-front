import { ProductsService } from '@/products/services/products.service';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shared-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent { 

  pages = input(0)
  currentPage = input<number>(1)
  activePage = linkedSignal(this.currentPage)

  //Obtenemos el total de páginas formando un array con el número de páginas que recibimos del servicio
  // y luego lo transformamos en un array de números del 1 al total de páginas
  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1)
   })
}
