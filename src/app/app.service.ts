import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Product } from './interfaces';
export const PRODUCT_API = 'products';
@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private apiUrl: string,
  ) {}

  getProducts(): Observable<Product[]> {
    return of([
      {
        id: '1',
        name: 'Coke',
        price: 20,
        image:
          'https://toppng.com/uploads/preview/coke-free-desktop-115385941292ptblrvxaz.png',
        stock: 10,
      },
      {
        id: '2',
        name: 'Pepsi',
        price: 25,
        image:
          'https://toppng.com/uploads/preview/pepsi-11538681711xinb1lyzap.png',
        stock: 10,
      },
      {
        id: '3',
        name: 'Dew',
        price: 30,
        image:
          'https://toppng.com/uploads/preview/mountain-dew-image-11526062217u23bq6aak8.png',
        stock: 10,
      },
    ]);
    // return this.http.get(`${this.apiUrl}${PRODUCT_API}`);
  }

  dispenceProduct(product: Product) {
    const body = {
      id: product.id,
    };
    return this.http.put(`${this.apiUrl}${PRODUCT_API}`, body);
  }
}
