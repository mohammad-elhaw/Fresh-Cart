import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy{

  private readonly _CategoriesService = inject(CategoriesService)

  categoryList:WritableSignal<ICategory[]> = signal([]);

  private categoriesServiceSub:WritableSignal<Subscription | null> = signal(null);

  ngOnInit(): void {
    this.categoriesServiceSub.set(this._CategoriesService.getAllCategories().subscribe({
      next:(res)=>{
        this.categoryList.set(res.data);
      }
    }));
  }

  ngOnDestroy(): void {
    this.categoriesServiceSub()?.unsubscribe();
  }

}
