import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy{

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  isLoading:boolean = false;
  loginSubscription!:Subscription;

  loginForm:FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.pattern(/^\w+@[a-zA-Z]{4,}.com$/)]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]]
  });

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

  loginSubmit():void{
    if(this.loginForm.valid){
      this.isLoading = true;
      this.loginSubscription = this._AuthService.sendLoginFrom(this.loginForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false;
          if(res.message == "success"){

            localStorage.setItem("userToken", res.token);
            this._Router.navigate(["/home"]);
            
          }
        },
        error:(err:HttpErrorResponse)=>{
          this.isLoading = false;
        }
      });
    }
    else{
      this.loginForm.markAllAsTouched();
    }
  }
}
