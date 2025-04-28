import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { ProductsService } from '@/products/services/products.service';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent { 

  productsService = inject(ProductsService)
  paginationService = inject(PaginationService)

  images = signal<string[]>([])

  productsResource = rxResource({
    request: () => ({page: this.paginationService.currentPage() - 1 }),
    loader: ({request}) => {
      return this.productsService.getProducts({offset:request.page * 8});
    }
  })

  

}
