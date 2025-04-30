import { Product } from '@/products/interfaces/product.interface';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ProductCarouselComponent } from "../../../../products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@/products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit{

  product = input.required<Product>();
  wasSaved = signal(false);
  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);
  imagesToCarousel = computed(() =>{
    const currentProductImages = [...this.product().images, ...this.tempImages()]
    return currentProductImages
  })

  fb = inject(FormBuilder)
  productsService = inject(ProductsService)
  router = inject(Router)

  productForm = this.fb.group({
    title: ['',[Validators.required]],
    description: ['',[Validators.required]],
    slug:['',[Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0,[Validators.required, Validators.min(0)]],
    stock: [0,[Validators.required, Validators.min(0)]],
    sizes: [[''],],
    tags: [''],
    images: [[]],
    gender: ['men',[Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  })

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit():void{
    this.setFormValue(this.product());

  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });  }

  //Si clicka en una talla, se añade a la lista de tallas si no está, o se elimina si ya está
  onSizeClicked(size:string){

    const currentSizes = this.productForm.value.sizes ?? []
    if (currentSizes.includes(size)){
      currentSizes.splice(currentSizes.indexOf(size), 1)
  }else{
    currentSizes.push(size)
  }
}

  async onSubmit() {

    const isValid = this.productForm.valid
    this.productForm.markAllAsTouched()
    if(!isValid) return
    
    const formValue = this.productForm.value

    const productLike: Partial<Product> = {
      ...(formValue as any), //Este es el formato de producto que guarsariamos en la base de datos
      tags: formValue.tags?.toLowerCase().split(',').map((tag: string) => tag.trim()) ?? [],
    }

    if(this.product().id === 'new'){
      const product = await firstValueFrom(this.productsService.createProduct(productLike, this.imageFileList))      
      this.router.navigate(['/admin/products', product.id])      
    }
    else{
      await firstValueFrom(this.productsService.updateProduct(this.product().id, productLike, this.imageFileList))      

    }

    this.wasSaved.set(true)
    setTimeout(() =>{
      this.wasSaved.set(false)
    }, 3000)
  }

  onFilesChanged(event: Event){
    const fileList = (event.target as HTMLInputElement).files
    this.imageFileList = fileList ?? undefined
    this.tempImages.set([]) // Resetear la lista de imagenes temporales

    //Guardar las imagenes en la lista de imagenes temporales
    const imageUrls = Array.from(fileList ?? []).map((file: File) => URL.createObjectURL(file))
    console.log({imageUrls})
    this.tempImages.set(imageUrls)
  }
}
