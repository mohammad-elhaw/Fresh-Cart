import { Injectable } from '@angular/core';
import { WishListService } from './wish-list.service';
import { IProduct } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductMapperService {

  constructor(private _WishListService: WishListService) { }


  private mapToProduct(apiProduct:any):IProduct{
    return {
      sold: apiProduct.sold,
      images: apiProduct.images,
      subcategory: apiProduct.subcategory,
      ratingsQuantity: apiProduct.ratingsQuantity,
      _id: apiProduct._id,
      title: apiProduct.title,
      slug: apiProduct.slug,
      description: apiProduct.description,
      quantity: apiProduct.quantity,
      price: apiProduct.price,
      imageCover: apiProduct.imageCover,
      category: apiProduct.category,
      brand: apiProduct.brand,
      ratingsAverage: apiProduct.ratingsAverage,
      createdAt: apiProduct.createdAt,
      updatedAt: apiProduct.updatedAt,
      id: apiProduct.id,
      isInWishList: this._WishListService.isProductInWishList(apiProduct.id)
    }
  }


  mapToproductList(apiProudcts:any):IProduct[]{
    return apiProudcts.map((product:any) => this.mapToProduct(product));
  }
}
