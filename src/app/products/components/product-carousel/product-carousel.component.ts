import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from "../../pipes/product-image.pipe";


@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles: `
    .swiper{
      width: 100%;
      height: 500px;
    }`
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges{

  images = input.required<string[]>()
  swiperDiv = viewChild.required<ElementRef>('swiperDiv')

  swiper: Swiper | undefined = undefined

  ngAfterViewInit(){
    this.swiperInit()
  }

  swiperInit(){
    const elemenet = this.swiperDiv().nativeElement;
    if(!elemenet) return;
    
    console.log({elemenet})
    this.swiper = new Swiper(elemenet, {
      direction: 'horizontal',
      loop: true,

      modules:[Navigation,Pagination],

      pagination: {
        el: '.swiper-pagination',
      },
    
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    
      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    //Si es el primer cambio, no se hace nada ya que es la inicialización
    if(changes['images'].firstChange) return

    // Si no hay swiper, no se hace nada
    if(!this.swiper) return
    
    // Se destruye el swiper y se vuelve a inicializar cin las nuevas imagenes
    this.swiper.destroy(true, true)

    const paginationEl: HTMLDivElement = 
    this.swiperDiv().nativeElement?.querySelector('.swiper-pagination'); 

    paginationEl.innerHTML = '';

    setTimeout(() => {
      this.swiperInit()
    }
  ),100

    
  } 


}
