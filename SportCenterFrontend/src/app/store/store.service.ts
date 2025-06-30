import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductData } from '../shared/interfaces/productData';
import { Observable } from 'rxjs';
import { Brand } from '../shared/interfaces/brand';
import { Type } from '../shared/interfaces/type';
import { Product } from '../shared/interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  public apiUrl = "http://localhost:8080/api/products";

  constructor(private http: HttpClient) { }

  getProducts(brandId?: number, typeId?: number, url?: string): Observable<ProductData> {
    // construct the url based on brandId and typeId
    // let url = `${this.apiUrl}?`;

    // if (brandId && brandId !== 0) {
    //   url += `brandId=${brandId}&`;
    // }

    // if (typeId && typeId !== 0) {
    //   url += `typeId=${typeId}&`;
    // }

    // if (url.endsWith('&')) {
    //   url = url.slice(0, -1);
    // }

    const apiUrl = url || this.apiUrl;

    console.log("url: " + url);
    // const url = `${this.apiUrl}?brandId=${brandId}&typeId=${typeId}`;
    return this.http.get<ProductData>(apiUrl);
  }

  getProduct(id: number) {
    return this.http.get<Product>(this.apiUrl + "/" + id);
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
