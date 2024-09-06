import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { WishListService } from '../../core/services/wish-list.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ProductMapperService } from '../../core/services/product-mapper.service';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss'
})
export class WishListComponent implements OnInit, OnDestroy{

  private readonly _WishListService = inject(WishListService);
  private readonly _CartService = inject(CartService);
  private readonly _ProductMapperService = inject(ProductMapperService);

  wishList:WritableSignal<IProduct[]> = signal([]);
  
  private wishListServiceSub:WritableSignal<Subscription | null> = signal(null);
  private removeItemSub:WritableSignal<Subscription | null> = signal(null);
  private addProductToCartSub:WritableSignal<Subscription| null> = signal(null);

  ngOnInit(): void {
    this.getAllWishListItems();
  }

  ngOnDestroy(): void {
    this.wishListServiceSub()?.unsubscribe();
    this.removeItemSub()?.unsubscribe();
    this.addProductToCartSub()?.unsubscribe();
  }

  getAllWishListItems():void{
    this.wishListServiceSub.set(this._WishListService.getLoggedUserWishList().subscribe({
      next:(res)=>{
        this.wishList.set(this._ProductMapperService.mapToproductList(res.data));
      }
    }));
  }

  addProductToCart(productId:string):void{
    this.addProductToCartSub.set(this._CartService.addProductToCart(productId).subscribe({
      next:()=>{
        this.deleteItem(productId);
      }
    }));
  }

  deleteItem(productId:string):void{
    this.removeItemSub.set(this._WishListService.removeProductFromWishList(productId).subscribe({
      next:()=>{
        this.getAllWishListItems();
      }
    }));
  }
}
