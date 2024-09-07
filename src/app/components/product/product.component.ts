import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { ProductMapperService } from '../../core/services/product-mapper.service';
import { WishListService } from '../../core/services/wish-list.service';
import { NgClass } from '@angular/common';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [StarRatingComponent, RouterLink, NgClass],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit, OnDestroy{

  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ProductMapperService = inject(ProductMapperService);
  private readonly _WishListService = inject(WishListService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _ToastrService = inject(ToastrService);

  productList:WritableSignal<IProduct[]> = signal([]);
  categoryList:WritableSignal<ICategory[]> = signal([]);
  isDropDownOpen:WritableSignal<boolean> = signal(false);

  private getAllProductSub:WritableSignal<Subscription | null> = signal(null);
  private addProductToCartSub:WritableSignal<Subscription | null> = signal(null);
  private removeWishListSub:WritableSignal<Subscription | null> = signal(null);
  private addWishListSub:WritableSignal<Subscription | null> = signal(null);

  ngOnInit(): void {

    this.getAllProductSub.set(this._WishListService.getLoggedUserWishList().pipe(
      switchMap(()=>this._ProductsService.getAllProducts())
    ).subscribe({
      next:(res)=>{
        this.productList.set(this._ProductMapperService.mapToproductList(res.data));
      }
    }));

    this._CategoriesService.getAllCategories().subscribe({
      next:(res)=>{
        this.categoryList.set(res.data);
      }
    });
  }

  ngOnDestroy(): void {
    this.getAllProductSub()?.unsubscribe();
    this.addProductToCartSub()?.unsubscribe();
    this.addWishListSub()?.unsubscribe();
    this.removeWishListSub()?.unsubscribe();
  }


  addToCart(id:string):void{
    this.addProductToCartSub.set(this._CartService.addProductToCart(id).subscribe());
  }

  toggleWishList(product:IProduct):void{
    if(product.isInWishList){
      this.removeWishListSub.set(this._WishListService.removeProductFromWishList(product.id).subscribe({
        next:()=>{
          product.isInWishList = false;
        }
      }));
    }
    else{
      this.addWishListSub.set(this._WishListService.addProductToWishList(product.id).subscribe({
        next:()=>{
          product.isInWishList = true;
        }
      }));
    }
  }

  toggleDropDown():void{
    this.isDropDownOpen.set(!this.isDropDownOpen());
  }

  filterProduct(categoryName:string):void{
    this._ProductsService.getAllProducts().subscribe({
      next:(res)=>{
        this.productList.set(
          res.data.filter((product:any) => product.category.name == categoryName)
        );
        
        if(!this.productList().length){
          this._ToastrService.error(`There is No Products for ${categoryName} category`);
        }

      }
    });
    
  }

}
