import { HttpClient } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { IUserData } from '../interfaces/iuser-data';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private _HttpClient:HttpClient) { }

  checkOut(cartId:string, shippingDetails:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${environment.serverUrl}`,
      {
        "shippingAddress": shippingDetails
      }
    );
  }

  getUserOrders(userId:string):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/orders/user/${userId}`);
  }

}
