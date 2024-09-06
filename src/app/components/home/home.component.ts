import { Component, OnDestroy, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription, switchMap } from 'rxjs';
import { StarRatingComponent } from "../star-rating/star-rating.component";
import { CategoriesService } from '../../core/services/categories.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ICategory } from '../../core/interfaces/icategory';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishListService } from '../../core/services/wish-list.service';
import { ProductMapperService } from '../../core/services/product-mapper.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StarRatingComponent, CarouselModule, RouterLink, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _CartService = inject(CartService);
  private readonly _WishListService = inject(WishListService);
  private readonly _ProductMapperService = inject(ProductMapperService);

  productList:WritableSignal<IProduct[]> = signal([]);
  categoryList:WritableSignal<ICategory[]> = signal([]);

  getAllProductSub!:Subscription;
  getAllCategoriesSub!:Subscription;
  addToCartSub!:Subscription;
  addProductToWishListSub!:Subscription;

  customOptionsCat: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    dots: false,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['prev', 'next'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
    nav: true
  }

  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: true
  }

  ngOnInit(): void {

    this.getAllProductSub = this._WishListService.getLoggedUserWishList().pipe(
      switchMap(()=>this._ProductsService.getAllProducts())
    ).subscribe({
      next:(res)=>{
        this.productList.set(this._ProductMapperService.mapToproductList(res.data));
      }
    });

    this.getAllCategoriesSub = this._CategoriesService.getAllCategories().subscribe({
      next:(res)=>{
        this.categoryList.set(res.data);
      }
    });
  }

  ngOnDestroy(): void {
    this.getAllProductSub?.unsubscribe();
    this.getAllCategoriesSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
    this.addProductToWishListSub?.unsubscribe();
  }


  addToCart(id:string):void{
    this._CartService.addProductToCart(id).subscribe();
  }


  toggleWishList(product:IProduct):void{
    if(product.isInWishList){
      this._WishListService.removeProductFromWishList(product.id).subscribe({
        next:()=>{
          product.isInWishList = false;
        }
      });
    }
    else{
      this._WishListService.addProductToWishList(product.id).subscribe({
        next:()=>{
          product.isInWishList = true;
        }
      });
    }
  }
  

}
