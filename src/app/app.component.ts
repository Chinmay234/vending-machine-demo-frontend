import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { Product } from './interfaces';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private appService: AppService) {}

  title = 'Vending machine';

  /* user wallet containing some initial amount */
  penny = { available: 5, value: 1 };
  nickel = { available: 5, value: 5 };
  dime = { available: 5, value: 10 };
  quarter = { available: 5, value: 25 };

  cart = {
    penny: 0,
    nickel: 0,
    dime: 0,
    quarter: 0,
  };

  orders: any = [];
  products$: Observable<Product[]> = new Observable();

  ngOnInit(): void {
    this.products$ = this.appService.getProducts();
  }

  trackByFn(index: number) {
    return index;
  }

  /* load / insert coins into vending machine */
  addToCart(coin: string) {
    if (coin == 'penny') {
      this.cart.penny++;
      this.penny.available--;
    }
    if (coin == 'nickel') {
      this.cart.nickel++;
      this.nickel.available--;
    }
    if (coin == 'dime') {
      this.cart.dime++;
      this.dime.available--;
    }
    if (coin == 'quarter') {
      this.cart.quarter++;
      this.quarter.available--;
    }
    this.addOrderHistory(coin, 'coin');
  }

  /* total wallet balance of user. */
  get totalWalletBalance() {
    return (
      this.penny.available * this.penny.value +
      this.nickel.available * this.nickel.value +
      this.dime.available * this.dime.value +
      this.quarter.available * this.quarter.value
    );
  }

  /* total cart balance of loaded coings */
  get totalCartBalance() {
    return (
      this.penny.value * this.cart.penny +
      this.nickel.value * this.cart.nickel +
      this.dime.value * this.cart.dime +
      this.quarter.value * this.cart.quarter
    );
  }

  addOrderHistory(name: string, type: string) {
    let order = {
      time: new Date().toUTCString(),
      name: name,
    };
    if (type == 'order') {
      order.name += ' dispenced !';
    } else if (type == 'change') {
      order.name += ' collected !';
    } else if (type == 'coin') {
      order.name += ' added !';
    }
    this.orders.unshift(order);
  }

  /* dispence one product after loading the coin into vending machine.
    if loaded price is eqal or more than the product price, dispence button will be enabled for that product
  */
  dispenceProduct(product: Product) {
    //service http call here
    this.addOrderHistory(product.name, 'order');

    const [penny, nickel, dime, quarter] = this.calculateChange(
      this.totalCartBalance,
      product.price,
    );

    this.cart = {
      penny,
      nickel,
      dime,
      quarter,
    };
    this.appService.dispenceProduct(product).subscribe((res) => {
      this.products$ = this.appService.getProducts();
    });
  }

  /* collect the remaining change from the vending machine, refund to wallet */
  collectChange() {
    this.penny.available += this.cart.penny;
    this.nickel.available += this.cart.nickel;
    this.dime.available += this.cart.dime;
    this.quarter.available += this.cart.quarter;
    this.cart = {
      nickel: 0,
      penny: 0,
      dime: 0,
      quarter: 0,
    };
    this.addOrderHistory('Change', 'change');
  }

  /* calculate change after a product is dispenced. 
  if the loaded price is heigher than product price return change. */
  calculateChange(M: any, P: number) {
    var change = M - P;
    var denominations = [1, 5, 10, 25];
    var change_integer = change - (change % 25);
    var change_fraction = change - change_integer;
    var output = [0, 0, 0, 0];
    for (var i = denominations.length - 1; i >= 0; i--) {
      var integer = change_integer / denominations[i];
      if (integer >= 1) {
        output[i] = integer;
        change_integer -= denominations[i] * integer;
      }
      var fraction = change_fraction / denominations[i];
      if (fraction >= 1) {
        output[i] = fraction;
        change_fraction -= denominations[i] * fraction;
      }
    }
    return output;
  }
}
