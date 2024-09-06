import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-passowrd',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget-passowrd.component.html',
  styleUrl: './forget-passowrd.component.scss'
})
export class ForgetPassowrdComponent implements OnDestroy{

  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);

  
  errorMsg:string = "";
  successMsg:string = "";

  verifyEmailSubscription!:Subscription;
  verifyCodeSubscription!:Subscription;
  resetPasswordSubscription!:Subscription;

  isLoading:boolean = false;
  step:number = 1;

  ngOnDestroy(): void {
    this.verifyEmailSubscription?.unsubscribe();
    this.verifyCodeSubscription?.unsubscribe();
    this.resetPasswordSubscription?.unsubscribe();
  }

  verifyEmail:FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.pattern(/^\w+@[a-zA-Z]{4,}.com$/)])
  });

  verifyCode:FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)])
  });

  resetPassword:FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.pattern(/^\w+@[a-zA-Z]{4,}.com$/)]),
    newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)])
  });

  
  submitVerifyEmail():void{
    if(this.verifyEmail.valid){

      let emailValue = this.verifyEmail.get("email")?.value;
      this.resetPassword.get("email")?.patchValue(emailValue);

      this.isLoading = true;
      this.verifyEmailSubscription = this._AuthService.setVerifyEmail(this.verifyEmail.value).subscribe({
        next:(res)=>{
          console.log(res);
          this.isLoading = false;
          if(res.statusMsg == "success"){
            this.errorMsg = "";
            this.successMsg = res.message;

            ++this.step;
          }

        },
        error:(err:HttpErrorResponse)=>{
          console.log(err);
          this.isLoading = false;
          this.errorMsg = err.error.message;
        }
      });
    }
    else{
      this.verifyEmail.markAllAsTouched();
    }
    
  }

  submitVerifyCode():void{
    if(this.verifyCode.valid){
      this.isLoading = true;
      this.successMsg = "";
      this.verifyCodeSubscription = this._AuthService.setVerifyCode(this.verifyCode.value).subscribe({
        next:(res)=>{
          console.log(res);
          this.isLoading = false;
          if(res.status == "Success"){
            this.errorMsg = "";
            this.successMsg = res.message;
            
            ++this.step;
          }

        },
        error:(err:HttpErrorResponse)=>{
          console.log(err);
          this.isLoading = false;
          this.errorMsg = err.error.message;
        }
      });
    }
    else{
      this.verifyCode.markAllAsTouched();
    }
  }

  submitResetPassword():void{
    if(this.resetPassword.valid){
      this.isLoading = true;
      this.successMsg = "";
      this.resetPasswordSubscription = this._AuthService.setResetPassword(this.resetPassword.value).subscribe({
        next:(res)=>{
          console.log(res);
          this.isLoading = false;
          this.errorMsg = "";
          
          localStorage.setItem("userToken", res.token);
          this._AuthService.saveUserData();
          this._Router.navigate(["/home"]);
          

        },
        error:(err:HttpErrorResponse)=>{
          console.log(err);
          this.isLoading = false;
          this.errorMsg = err.error.message;
        }
      });
    }
    else{
      this.resetPassword.markAllAsTouched();
    }
  }




}
