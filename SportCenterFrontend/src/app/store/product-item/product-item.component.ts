import { Component, Input } from '@angular/core';
import { Product } from '../../shared/interfaces/product';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss'
})
export class ProductItemComponent {
  @Input()
  product!: Product;

  constructor(private basketService: BasketService) { }

  addItemToBasket() {
    this.product && this.basketService.addItemToBasket(this.product);
  }

  // method to extract the image name from pictureUrl
  extractImageName(): string | null {
    if (this.product && this.product.pictureUrl) {
      const parts = this.product.pictureUrl.split('/');
      if (parts.length > 0) {
        return parts[parts.length - 1]; // return last part
      }
    }

    return null; // it is invalid
  }

}
