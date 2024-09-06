import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  constructor(
    private _HttpClient :HttpClient,
    private _ToastrService :ToastrService
  ) { }

  private productListIds:WritableSignal<string[]> = signal([]);

  addProductToWishList(productId:string):Observable<any>{
    return this._HttpClient.post<any>(`${environment.baseUrl}/api/v1/wishlist`,
      {
        "productId": productId
      }
    ).pipe(tap({
      next:(res)=>{
        this.productListIds.update(ids=> [...ids, productId]);
        this._ToastrService.success(res.message);
      }
      

    }));
  }

  removeProductFromWishList(productId:string):Observable<any>{
    return this._HttpClient.delete<any>(`${environment.baseUrl}/api/v1/wishlist/${productId}`
    ).pipe(tap({
      next:(res)=>{
        this.productListIds.update(ids=> ids.filter(id => id !== productId));
        this._ToastrService.success(res.message);
      }
      
    }));
  }

  getLoggedUserWishList():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/wishlist`
    ).pipe(tap((res:any)=>{
      this.productListIds.set(res.data.map((product:any)=> product.id));
    }));
  }

  isProductInWishList(productId:string):boolean{
    return this.productListIds().includes(productId);
  }

}
