import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private _HttpClient:HttpClient,
    private _ToastrService :ToastrService
  ) { }
  
  // variable for cart subscription
  // cartCountItem:BehaviorSubject<number> = new BehaviorSubject(0);
  cartCountItem:WritableSignal<number> = signal(0);

  getLoggedUserCart():Observable<any>{
    return this._HttpClient.get<any>(`${environment.baseUrl}/api/v1/cart`);
  }

  addProductToCart(id:string):Observable<any>{
    return this._HttpClient.post<any>(`${environment.baseUrl}/api/v1/cart`,
      {productId: id}
    ).pipe(tap({
      next:(res)=>{
        this.cartCountItem.set(res.numOfCartItems);
        this._ToastrService.success(res.message, "ShopIt");
      }
    }));
  }


  updateCartProductQuantity(id:string, num:number):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`,
      {
        count: num
      }
    ).pipe(tap({
      next:()=>{
        this._ToastrService.success("product Count updated Successfully", "ShopIt");
      }
    }));
  }


  removeSpecificCartItem(id:string):Observable<any>{
    return this._HttpClient.delete<any>(`${environment.baseUrl}/api/v1/cart/${id}`).pipe(
      tap({
        next:(res)=>{
          this.cartCountItem.set(res.numOfCartItems || 0);
          this._ToastrService.success("Item Deleted Successfully", "ShopIt");
        }
      })
    );
  }


  removeUserCart():Observable<any>{
    return this._HttpClient.delete<any>(`${environment.baseUrl}/api/v1/cart`).pipe(
      tap({
        next:()=>{
          this.cartCountItem.set(0);
          this._ToastrService.success("Cart Cleared Successfully", "ShopIt");
        }
      })
    );
  }
}
