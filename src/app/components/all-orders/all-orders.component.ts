import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { IUserData } from '../../core/interfaces/iuser-data';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements OnInit{

  private readonly _AuthService = inject(AuthService);
  private readonly _OrdersService = inject(OrdersService);


  theUserData:Signal<IUserData | null> = computed(()=> this._AuthService.userData());

  ngOnInit(): void {
    this._AuthService.saveUserData();
    console.log(this.theUserData());
    const userId = this.theUserData()?.id;
    if(userId) this.getAllUserOrders(userId);
  }

  getAllUserOrders(userId:string){
    this._OrdersService.getUserOrders(userId).subscribe({
      next:(res)=>{
        console.log(res);
      }
    });
  }
  
}
