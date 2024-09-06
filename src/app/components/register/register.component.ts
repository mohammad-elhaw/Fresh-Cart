import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy{

  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);

  isLoading:boolean = false;
  registerSubscription!:Subscription;

  ngOnDestroy(): void {
    this.registerSubscription?.unsubscribe();
  }
  
  registerForm:FormGroup = this._FormBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.pattern(/^\w+@[a-zA-Z]{4,}.com$/)]],
    password: [null, [Validators.required, Validators.pattern(/^\w{6,}$/)]],
    rePassword: [null],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
  }, {"validators": this.confirmPassword});

  // registerForm:FormGroup = new FormGroup({
  //   name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  //   email: new FormControl(null, [Validators.required, Validators.pattern(/^\w+@[a-zA-Z]{4,}.com$/)]),
  //   password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
  //   rePassword: new FormControl(null),
  //   phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
  // }, this.confirmPassword);


  registerSubmit():void{
    if(this.registerForm.valid && !this.isLoading){
      this.isLoading= true;

      this.registerSubscription = this._AuthService.sendRegistrationForm(this.registerForm.value).subscribe({
        next:(res)=>{
          this.isLoading= false;
          console.log(res);
          if(res.message == "success"){
            this._ToastrService.success("You register successfully.");
            this._Router.navigate(["/login"]);
          }
        },
        error:(err:HttpErrorResponse)=>{
          this.isLoading= false;
        }
      });
    }
    else{
      this.registerForm.markAllAsTouched();
    }
  }

  confirmPassword(g:AbstractControl){
    return g.get("password")?.value === g.get("rePassword")?.value 
    ? null : {'mismatch': true}; 
  }
}
