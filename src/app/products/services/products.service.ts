import { User } from '@/auth/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl

interface Options {
  limit?: number;
  offset?: number;
  gender?:string;
}

const emptyProduct:Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  private http = inject(HttpClient)

  private productsCache = new Map<string, ProductsResponse>()
  private productCache = new Map<string, Product>()


  getProducts(options:Options):Observable<ProductsResponse> {
  const { limit = 8, offset = 0, gender = ''} = options
  const key = `${limit}-${offset}-${gender}`
  //Creamos una clave única para cada combinación de parámetros
  //Si la clave ya existe en el cache, devolvemos el valor del cache
  if(this.productsCache.has(key)){
    return of(this.productsCache.get(key)!)
  }
    return this.http
    .get<ProductsResponse>(`${baseUrl}/products`,{
      params:{
      limit,
      offset,
      gender,
    }
  }).pipe(
    tap((resp) => this.productsCache.set(key, resp)),// Guardamos la respuesta en el cache
    tap(res => console.log(res))
  )
    
    }

    getProductByIdSlug(idSlug:string):Observable<Product>{
      //Si la clave ya existe en el cache, devolvemos el valor del cache
      if(this.productCache.has(idSlug)){
        return of(this.productCache.get(idSlug)!)
      }
      return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
        tap((resp) => this.productCache.set(idSlug, resp)),// Guardamos la respuesta en el cache
        tap(res => console.log(res))
      )

      
    }
    getProductById(id:string): Observable<Product> {
    if(id === 'new'){
      return of(emptyProduct)
    }

      if(this.productCache.has(id)){
        return of(this.productCache.get(id)!)
      }
      return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
        tap((resp) => this.productCache.set(id, resp)),// Guardamos la respuesta en el cache
        tap(res => console.log(res))
      )
    }

    updateProduct(id:string, 
      productLike:Partial<Product>, 
      imageFileList?: FileList
    ):Observable<Product> {
      //Pasamos las imagenes de producto a una constante para evaluar si tenemos imagenes
      const currentImages = productLike.images ?? []

      return this.uploadImages(imageFileList).pipe(
        //Mapeamos las imagenes a las imagenes de prooducts like haciendo un spread (segundo parametro), 
        //Manteniendo el resto de las propeidades que tuviera (primer parametro)
        map((imageNames) =>({
          ...productLike, images:[...currentImages, ...imageNames]
        }) ),
        //Mandamos la peticion http con el producto actualizado
        switchMap((updatedProduct) => 
          this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)),
        tap((resp) => this.updateProductCache(resp)),// Actualizamos la caché
      )

      // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike).pipe(
      //   tap((resp) => this.updateProductCache(resp)),// Actualizamos la caché
      // )

    }

    createProduct(productLike: Partial<Product>, imageFileList?: FileList):Observable<Product> {
      return this.http.post<Product>(`${baseUrl}/products`, productLike).pipe(
        tap((resp) => this.updateProductCache(resp)),// Actualizamos la caché
      )  
    }

    //Actualizamos las cachés al actualizar un producto
    updateProductCache(product:Product){
      const productId = product.id

      //Para la caché de producto individual, basta con reemplazar el producto
      this.productCache.set(productId, product)

      //Para la caché general, como no podemos saber la key al ser una concatenación de parámetros
      //Recorremos el mapa buscando el producto (el que el id sea identico)
      this.productsCache.forEach((productResponse) => {
        productResponse.products = productResponse.products.map(
            (currentProduct) =>
           currentProduct.id === productId ? product: currentProduct
        );

      });
    }
  
    uploadImages (images?: FileList):Observable<string[]> {
      if(!images) return of([])
      const uploadObservables = Array.from(images).map((imageFile) => this.uploadImage(imageFile))
      return forkJoin(uploadObservables).pipe(
        tap((imageNames) => console.log({imageNames})),
      )
    }



    uploadImage(imageFile: File):Observable<string> {
      const formData = new FormData()
      formData.append('file', imageFile)
      return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData).pipe(
        map((resp) => resp.fileName)
      )
    }

}
