import { ProductsService } from '@/products/services/products.service';
import { Component, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent { 

  productService = inject(ProductsService)
  
  activatedRoute = inject(ActivatedRoute);
  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];


  productResource = rxResource({
    request: () => ({idSlug:this.productIdSlug}),
    loader: ({request}) => {
      return this.productService.getProductByIdSlug(request.idSlug);
    }
  })

}
