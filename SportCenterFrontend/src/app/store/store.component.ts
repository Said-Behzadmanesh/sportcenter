import { Component, Input, OnInit } from '@angular/core';
import { StoreService } from './store.service';
import { Product } from '../shared/interfaces/product';
import { Brand } from '../shared/interfaces/brand';
import { Type } from '../shared/interfaces/type';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

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

  // for pagination
  totalElements = 60;
  currentPage = 1;
  page?: number;
  pageSize = 10;
  pageable?: {
    pageNumber: number,
    pageSize: number,
  };

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    // initializing selected brand and type
    this.fetchProducts();
    this.getBrands();
    this.getTypes();
  }

  fetchProducts(page: number = 1) {

    const backendPage = page - 1; // because of zero based index

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

    // search
    if (this.search) {
      url += `keyword=${this.search}&`;
    }

    // append the page
    url += `page=${backendPage}&size=${this.pageSize}`;

    // include sorting parameters only if selectedSort is not empty
    if (this.selectedSort !== 'asc') {
      url += `sort=name&order=${this.selectedSort}&`;
    }

    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }

    this.storeService.getProducts(brandId, typeId, url)
      .subscribe({
        next: (data) => {
          this.products = data.content;
          this.pageable = data.pageable;
          this.totalElements = data.totalElements;
          this.currentPage = data.pageable.pageNumber + 1;
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

  pageChanged(event: PageChangedEvent): void {
    if (event.page !== this.currentPage) {
      this.page = event.page;
      this.fetchProducts(event.page);
    }
  }
}
