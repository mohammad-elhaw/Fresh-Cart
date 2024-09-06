import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy{

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _OrdersService = inject(OrdersService);

  private cartId:string = '';

  private activatedRouteSub!:Subscription;
  private ordersServiceSub!:Subscription;

  ngOnInit(): void {
    this.activatedRouteSub = this._ActivatedRoute.paramMap.subscribe({
      next:(p)=>{
        this.cartId = p.get("cartId")!;
      }
    });
  }

  ngOnDestroy(): void {
    this.activatedRouteSub?.unsubscribe();
    this.ordersServiceSub?.unsubscribe();
  }

  orders:FormGroup = this._FormBuilder.group({
    details: [null, [Validators.required, Validators.minLength(5)]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: [null, Validators.required]
  });


  

  submitOrder():void{
    if(this.orders.valid){
      this._OrdersService.checkOut(this.cartId, this.orders.value).subscribe({
        next:(res)=>{
          console.log(res);
          if(res.status == "success"){
            window.open(res.session.url, "_self");
          }
        },
        error:(err)=>{
          console.log(err);
        }
      });
    }
    else{
      this.orders.markAllAsTouched();
    }
    
  }

}
