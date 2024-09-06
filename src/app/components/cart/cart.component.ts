import { Component, OnDestroy, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { ICart } from '../../core/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy{

  private readonly _CartService = inject(CartService);

  cartItem:WritableSignal<ICart> = signal({} as ICart);
  numberOfCartItem:Signal<number> = computed(()=>this._CartService.cartCountItem());

  private getUserCartSub:WritableSignal<Subscription | null> = signal(null);
  private deleteItemSub:WritableSignal<Subscription | null> = signal(null);
  private updateItemQuantitySub:WritableSignal<Subscription | null> = signal(null);
  private clearCartSub:WritableSignal<Subscription | null> = signal(null);

  ngOnInit(): void {
    this.getUserCartSub.set(this._CartService.getLoggedUserCart().subscribe({
      next:(res)=>{
        this.cartItem.set(res.data);
      }
    }));

    
  }

  ngOnDestroy(): void {
    this.getUserCartSub()?.unsubscribe();
    this.deleteItemSub()?.unsubscribe();
    this.updateItemQuantitySub()?.unsubscribe();
    this.clearCartSub()?.unsubscribe();
  }


  updateItemQuantity(id:string, count:number){
    if(count){
      this.updateItemQuantitySub.set(this._CartService.updateCartProductQuantity(id,count).subscribe({
        next:(res)=>{
          this.cartItem.set(res.data);
        }
      }));
    }
  }

  deleteItem(id:string):void{
    this.deleteItemSub.set(this._CartService.removeSpecificCartItem(id).subscribe({
      next:(res)=>{
        this.cartItem.set(res.data);
      }
    }));
  }

  clearCart():void{
    if(this.numberOfCartItem()){
      this.clearCartSub.set(this._CartService.removeUserCart().subscribe({
        next:()=>{
          this.cartItem.set({} as ICart);
        }
      }));
    }
    
  }
}
