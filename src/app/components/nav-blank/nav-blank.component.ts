import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from './../../core/services/flowbite.service';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss'
})
export class NavBlankComponent implements OnInit{
  readonly _FlowbiteService = inject(FlowbiteService);
  readonly _AuthService = inject(AuthService);
  readonly _CartService = inject(CartService);

  numberOfCartItem:Signal<number> = computed(()=>this._CartService.cartCountItem());

  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite => {});

    this._CartService.getLoggedUserCart().subscribe({
      next:(res)=>{
        this._CartService.cartCountItem.set(res.numOfCartItems);
      }
    });
  }

  toggleNavbar(navbar: HTMLElement): void {
    navbar.classList.toggle('hidden');
  }

}
