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
  selectedBrand: Brand = { id: 0, name: 'All' };
  selectedType: Type = { id: 0, name: 'All' };
  selectedSort = 'asc';
  search = '';

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    // initializing selected brand and type
    this.fetchProducts();
    this.getBrands();
    this.getTypes();
  }

  fetchProducts() {
    // pass the selected brand/type ids
    const brandId = this.selectedBrand.id;
    const typeId = this.selectedType.id;
    let url = `${this.storeService.apiUrl}?`;

    // check the brand and type
    if (brandId && brandId !== 0) {
      url += `brandId=${brandId}&`;
    }

    if (typeId && typeId !== 0) {
      url += `typeId=${typeId}&`;
    }

    if (this.selectedSort) {
      url += `sort=name&order=${this.selectedSort}&`;
    }

    // search
    if (this.search) {
      url += `keyword=${this.search}&`;
    }

    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }

    this.storeService.getProducts(brandId, typeId, url)
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

  onSortChange() {
    this.fetchProducts();
  }

  onSearch() {
    this.fetchProducts();
  }

  onReset() {
    this.search = '';
    this.fetchProducts();
  }
}
