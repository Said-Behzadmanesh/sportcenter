import { Component, Input, OnInit } from '@angular/core';
import { StoreService } from './store.service';
import { Product } from '../shared/interfaces/product';
import { Brand } from '../shared/interfaces/brand';
import { Type } from '../shared/interfaces/type';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements OnInit {
  @Input() title = "";
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  selectedBrand: Brand | null = null;
  selectedType: Type | null = null;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    // initializing selected brand and type
    this.selectedBrand = null;
    this.selectedType = null;
    this.fetchProducts();
    this.getBrands();
    this.getTypes();
  }

  private fetchProducts() {
    this.storeService.getProducts()
      .subscribe({
        next: (data) => {
          this.products = data.content;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });
  }

  getBrands() {
    this.storeService.getBrands().subscribe({
      next: (response) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error)
    });
  }

  getTypes() {
    this.storeService.getTypes().subscribe({
      next: (response) => (this.types = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error)
    });
  }

  selectBrand(brand: Brand) {
    // update the selected brand and fetch the products
    this.selectedBrand = brand;
    this.fetchProducts();
  }

  selectType(type: Type) {
    // update the selected type and fetch the products
    this.selectedType = type;
    this.fetchProducts();
  }
}
