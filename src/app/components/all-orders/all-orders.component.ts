import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { IDropDownItem } from '../../core/interfaces/idrop-down-item';
import { IUserData } from '../../core/interfaces/iuser-data';
import { AuthService } from '../../core/services/auth.service';
import { OrdersService } from '../../core/services/orders.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements OnInit{

  private readonly _AuthService = inject(AuthService);
  private readonly _OrdersService = inject(OrdersService);
  
  theUserData:Signal<IUserData | null> = computed(()=> this._AuthService.userData());
  
  dropDownItems:WritableSignal<IDropDownItem[]> = signal([]);
  isDropDownOpen:WritableSignal<Map<number, boolean>> = signal(new Map<number,boolean>());

  ngOnInit(): void {
    this._AuthService.saveUserData();
    const userId = this.theUserData()?.id;
    if(userId){
      this.getAllUserOrders(userId);
    } 
  }

  

  getAllUserOrders(userId:string){
    this._OrdersService.getUserOrders(userId).subscribe({
      next:(res)=>{
        this.dropDownItems.set(res);
        const dropDownStates = new Map<number, boolean>();

        res.forEach((item:any) => dropDownStates.set(item.id, false));
        this.isDropDownOpen.set(dropDownStates);
      }
    });
  }

  toggleDropDown(id:number):void{
    const currentState = this.isDropDownOpen();
    currentState.set(id, !currentState.get(id));
    this.isDropDownOpen.set(currentState);
  }

  isOpen(id:number):boolean{
    return this.isDropDownOpen().get(id) || false;
  }
  
}
