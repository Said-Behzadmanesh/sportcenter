import { BasketItem } from './../../shared/interfaces/basket';
import { Component } from '@angular/core';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  constructor(public basketService: BasketService) { }

  getItemCount(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0) || ([])
  }
}
