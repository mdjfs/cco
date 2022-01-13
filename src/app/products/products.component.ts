import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  menuStatus: string = '';

  constructor() {}

  ngOnInit(): void {}

  openMenu(): void {
    this.menuStatus = 'open';
  }

  closeMenu(): void {
    this.menuStatus = '';
  }

  openDots(event: MouseEvent): void {
    const { parentElement } = event.target as HTMLDivElement;
    if (parentElement) parentElement.classList.toggle('open');
  }
}
