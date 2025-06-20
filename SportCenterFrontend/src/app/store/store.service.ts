import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductData } from '../shared/interfaces/productData';
import { Observable } from 'rxjs';
import { Brand } from '../shared/interfaces/brand';
import { Type } from '../shared/interfaces/type';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private apiUrl = "http://localhost:8080/api/products";

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductData> {
    return this.http.get<ProductData>(this.apiUrl);
  }

  getBrands() {
    const url = `${this.apiUrl}/brands`;
    return this.http.get<Brand[]>(url);
  }

  getTypes() {
    const url = `${this.apiUrl}/types`;
    return this.http.get<Type[]>(url);
  }
}
