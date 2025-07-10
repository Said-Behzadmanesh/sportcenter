import { BasketTotals } from './../shared/interfaces/basket';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Basket, BasketItem } from '../shared/interfaces/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  apiUrl = 'http://localhost:8080/api/baskets';
  private basketSource = new BehaviorSubject<Basket | null>(null);
  basketSource$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<BasketTotals | null>({
    subtotal: 0,
    shipping: 0,
    total: 0
  });
  basketTotalSource$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) {
    // is there a basket in local storage when the service is initialized?
    const storedBasket = localStorage.getItem('basket');
    if (storedBasket) {
      const parsedBasket = JSON.parse(storedBasket);
      this.basketSource.next(parsedBasket);
      this.calculateTotals();
    }
  }

  getBasket(id: string) {
    return this.http.get<Basket>(this.apiUrl + '/' + id).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
        // update local storage with the latest basket data
        localStorage.setItem('basket', JSON.stringify(basket));
      }
    });
  }

  setBasket(basket: Basket) {
    return this.http.post<Basket>(this.apiUrl, basket).subscribe({
      next: basket => {
        this.basketSource.next(basket);
        this.calculateTotals();
        // update local storage with the latest basket data
        localStorage.setItem('basket', JSON.stringify(basket));
      }
    })
  }

  getCurrentBasket() {
    return this.basketSource.value;
  }

  addItemToBasket(item: Product, quantity = 1) {
    const itemToAdd = this.mapProductToBasket(item);
    const basket = this.getCurrentBasket() ?? this.createBasket();
    basket.items = this.upsertItems(basket.items, itemToAdd, quantity);
    this.setBasket(basket!);
  }

  upsertItems(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const item = items.find(i => i.id === itemToAdd.id);
    if (item) {
      item.quantity += quantity;
    }
    else {
      items.push({ ...itemToAdd, quantity: quantity });
    }
    return items;
  }

  createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket
  }

  private mapProductToBasket(item: Product): BasketItem {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      productBrand: item.productBrand,
      productType: item.productType,
      description: item.description,
      quantity: 0
    }
  }

  decrementItemQuantity(itemId: number, quantity: number = 1) {
    const basket = this.getCurrentBasket();
    if (basket) {
      const item = basket.items.find(i => i.id === itemId);
      if (item && item.quantity > 1) {
        item.quantity -= quantity;
        this.setBasket(basket);
      }
    }
  }

  incrementItemQuantity(itemId: number, quantity: number = 1) {
    const basket = this.getCurrentBasket();
    if (basket) {
      const item = basket.items.find(i => i.id === itemId);
      if (item) {
        item.quantity += quantity;
        if (item.quantity < 1) {
          item.quantity = 1;
        }
        this.setBasket(basket);
      }
    }
  }

  remove(itemId: number) {
    const basket = this.getCurrentBasket();
    if (!basket) {
      return;
    }

    const itemIndex = basket.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
      return;
    }

    // Remove the item from the array
    basket.items.splice(itemIndex, 1);

    // NOW, CHECK THE LENGTH
    if (basket.items.length > 0) {
      // If items remain, just update the basket
      this.setBasket(basket);
    } else {
      // If no items remain, delete the basket completely
      this.deleteBasket(basket);
    }
  }

  deleteBasket(basket: Basket) {
    return this.http.delete(this.apiUrl + '/' + basket.id).subscribe({
      next: () => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      },
      error: err => console.log(err)
    });
  }

  private calculateTotals() {
    const basket = this.getCurrentBasket();
    if (basket) {
      const shipping = 0;
      const subTotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
      const total = subTotal + shipping;
      this.basketTotalSource.next({ shipping, subtotal: subTotal, total });
    }
  }

  updateShippingPrice(shippingPrice: number) {
    const updateBasketTotal = this.basketTotalSource.value;
    if (updateBasketTotal) {
      updateBasketTotal.shipping = shippingPrice;
      updateBasketTotal.total = updateBasketTotal.subtotal + updateBasketTotal.shipping;
      this.basketTotalSource.next(updateBasketTotal);
    }
  }

  clearBasket() {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }
}

