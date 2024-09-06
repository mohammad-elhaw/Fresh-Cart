import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { IUserData } from '../interfaces/iuser-data';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _HttpClient = inject(HttpClient);
  private readonly _Router = inject(Router);

  userData:WritableSignal<IUserData | null> = signal(null);

  sendRegistrationForm(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, data);
  }

  sendLoginFrom(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, data);
  }

  saveUserData():void{
    if(localStorage.getItem("userToken")){
      this.userData.set(jwtDecode(localStorage.getItem("userToken")!));
    }
  }

  logOut():void{
    localStorage.removeItem("userToken");
    this.userData.set(null);
    this._Router.navigate(["/login"]);
  }

  setVerifyEmail(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, data);
  }

  setVerifyCode(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, data);
  }

  setResetPassword(data:object):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, data);
  }
}
