import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { Subscription } from 'rxjs';
import { IBrand } from '../../core/interfaces/ibrand';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy{

  private readonly _BrandsService = inject(BrandsService)

  brandsList:WritableSignal<IBrand[]> = signal([]);

  
  private getAllBrandsSub:WritableSignal<Subscription | null> = signal(null);

  ngOnInit(): void {
    this.getAllBrandsSub.set(this._BrandsService.getAllBrands().subscribe({
      next:(res)=>{
        this.brandsList.set(res.data);
      }
    }));
  }

  ngOnDestroy(): void {
    this.getAllBrandsSub()?.unsubscribe();
  }
}
