import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [StarRatingComponent, CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy{

  private readonly _ProductsService = inject(ProductsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _CartService = inject(CartService);

  productDetails:WritableSignal<IProduct | null> = signal(null);

  private getSpecificProductSub:WritableSignal<Subscription | null> = signal(null);
  private getParamMapSub:WritableSignal<Subscription | null> = signal(null);
  private addToCartSub:WritableSignal<Subscription| null> = signal(null);

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: true
  }

  ngOnInit(): void {
    this.getParamMapSub.set(this._ActivatedRoute.paramMap.subscribe({
      next:(p:ParamMap)=>{
        let productId = p.get("productId");
        this.getSpecificProductSub.set(this._ProductsService.getSpecificProduct(productId).subscribe({
          next:(res)=>{
            this.productDetails.set(res.data);
          }
        }));

      }
    }));
  }


  ngOnDestroy(): void {
    this.getSpecificProductSub()?.unsubscribe();
    this.getParamMapSub()?.unsubscribe();
    this.addToCartSub()?.unsubscribe();
  }


  addToCart(id:string):void{
    this._CartService.addProductToCart(id).subscribe();
  }


}
