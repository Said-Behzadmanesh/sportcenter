import { Basket, BasketItem } from './../../shared/interfaces/basket';
import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { AccountService } from '../../account/account.service';
import { User } from '../../shared/interfaces/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  currentUser$?: Observable<User | null>;
  basketSource$?: Observable<Basket | null>;

  constructor(public basketService: BasketService,
    public accountService: AccountService) { }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
    this.basketSource$ = this.basketService.basketSource$;
  }

  getItemCount(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0) || ([])
  }

  logout() {
    this.accountService.logout();
  }
}
