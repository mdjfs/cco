import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  date: string;
  id: string;
  feature: string;
  name: string;
  mail: string;
  price: string;
  unitAvailable: string;
  unitSold: string;
  location: string;
}

interface Search {
  docs: Product[];
  pages: number;
  total: number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('userImage') userImage: ElementRef<HTMLImageElement>;
  @ViewChild('productForm') form: ElementRef<HTMLFormElement>;

  menuStatus: string = '';
  productStatus: string = '';
  formMessage: string = '';

  productAttributes = {
    id: 'id',
    nombre: 'name',
    caracteristicas: 'feature',
    fecha: 'date',
    correo: 'mail',
    precio: 'price',
    pais: 'location',
    'unidades disponibles': 'unitAvailable',
    'unidades vendidas': 'unitSold',
  };

  productKeys = Object.keys(this.productAttributes);
  productValues = Object.values(this.productAttributes);

  page: number = 1;
  totalPages: number = 0;
  pageSize: number = 3;
  filterKey: string = 'name';
  filterSearch: string = '';
  order: string = 'name';

  search: Product[] = [];
  countries: any[] = [];

  lastInput: string = '';

  options: { value: string; name: string }[] = [];

  destroyID: number;
  destroyStatus: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOptions();
    this.loadCountries();
    this.loadSearch();
  }

  ngAfterViewInit(): void {
    this.loadPicture(this.userImage);
  }

  loadOptions() {
    this.options = [];
    for (const [firstKey, firstValue] of Object.entries(
      this.productAttributes
    )) {
      for (const [secondKey, secondValue] of Object.entries(
        this.productAttributes
      )) {
        if (firstKey === secondKey) {
          this.options.push({
            name: firstKey,
            value: firstValue,
          });
        } else {
          this.options.push({
            name: `${firstKey}, ${secondKey}`,
            value: `${firstValue},${secondValue}`,
          });
        }
      }
    }
  }

  loadSearch() {
    let filterItems = '';
    for (const attr of this.filterKey.split(',')) {
      if (this.filterSearch) {
        filterItems += `${attr}=${this.filterSearch}&`;
      }
    }
    console.log(
      `https://cco-backend.herokuapp.com/products?page=${this.page}&pageSize=${this.pageSize}&order=${this.order}&${filterItems}`
    );
    this.http
      .get<Search>(
        `https://cco-backend.herokuapp.com/product?page=${this.page}&pageSize=${this.pageSize}&order=${this.order}&${filterItems}`,
        {
          headers: {
            Authorization: localStorage.getItem('Authorization') as string,
          },
        }
      )
      .subscribe({
        next: (search) => {
          this.search = search.docs;
          this.totalPages = search.pages;
          console.log(search);
        },
      });
  }

  loadCountries() {
    this.http.get('https://restcountries.com/v3.1/all').subscribe({
      next: (countries) => {
        this.countries = countries as Object[];
      },
    });
  }

  loadPicture(reference: ElementRef<HTMLImageElement>) {
    const id = localStorage.getItem('user-id');
    if (reference.nativeElement) {
      const { src } = reference.nativeElement;
      reference.nativeElement.src =
        `https://cco-backend.herokuapp.com/pictureById?id=${id}&date=` +
        new Date().getTime();
      reference.nativeElement.onerror = () => {
        reference.nativeElement.src = src;
      };
    }
  }

  next() {
    this.page = this.page + 1;
    this.loadSearch();
  }

  prev() {
    this.page = this.page - 1;
    this.loadSearch();
  }

  last() {
    this.page = this.totalPages;
    this.loadSearch();
  }

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

  changeOrder(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.order = select.value;
    this.loadSearch();
  }

  changeFilter(event: Event) {
    const filter = event.target as HTMLSelectElement;
    this.filterKey = filter.value;
    this.loadSearch();
  }

  changeSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.lastInput = input.value;
    setTimeout(() => {
      if (this.lastInput === input.value) {
        this.filterSearch = input.value;
        this.loadSearch();
      }
    }, 250);
  }

  changePageSize(event: Event) {
    const pageSize = event.target as HTMLSelectElement;
    this.pageSize = parseInt(pageSize.value);
    this.page = 1;
    this.loadSearch();
  }

  logout(): void {
    localStorage.removeItem('Authorization');
    window.location.reload();
  }

  goto(route: string) {
    this.router.navigate([route]);
  }

  openProductModal() {
    this.productStatus = 'open';
  }

  closeProductModal() {
    this.productStatus = '';
  }

  ensureDestroy(id: string) {
    this.destroyID = parseInt(id);
    this.destroyStatus = 'open';
  }

  dontDestroy() {
    this.destroyID = 0;
    this.destroyStatus = '';
  }

  doDestroy() {
    this.destroy(this.destroyID);
    this.destroyID = 0;
    this.destroyStatus = '';
  }

  destroy(id: number) {
    this.http
      .delete(`https://cco-backend.herokuapp.com/product?id=${id}`, {
        headers: {
          Authorization: localStorage.getItem('Authorization') as string,
        },
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.loadSearch();
        },
      });
  }

  submitForm() {
    const isValid = this.form.nativeElement.checkValidity();
    if (isValid) {
      const formData = new FormData(this.form.nativeElement);
      this.http
        .post('https://cco-backend.herokuapp.com/product', formData, {
          headers: {
            Authorization: localStorage.getItem('Authorization') as string,
          },
          responseType: 'text',
        })
        .subscribe({
          next: () => {
            this.formMessage = '';
            this.productStatus = '';
            this.loadSearch();
            this.form.nativeElement.reset();
          },
          error: ({ error }) => {
            if (error === 'Validation error') {
              this.formMessage =
                'El producto con ese ID ya existe, por favor, escoje otro';
            } else {
              this.formMessage = error;
            }
          },
        });
    } else {
      this.formMessage = 'Por favor verifica la informacion del formulario';
    }
  }
}
