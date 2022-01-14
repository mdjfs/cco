import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('userImage') userImage: ElementRef<HTMLImageElement>;
  @ViewChild('profileImage') image: ElementRef<HTMLImageElement>;

  menuStatus: string = '';
  username: string = localStorage.getItem('user-username') as string;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadPicture(this.userImage);
    this.loadPicture(this.image);
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

  openMenu(): void {
    this.menuStatus = 'open';
  }

  closeMenu(): void {
    this.menuStatus = '';
  }

  logout(): void {
    localStorage.removeItem('Authorization');
    window.location.reload();
  }

  goto(route: string) {
    this.router.navigate([route]);
  }

  changePicture() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.style.display = 'none';
    document.body.append(input);
    input.click();
    input.onchange = () => {
      if (input.files && input.files[0]) {
        const data = new FormData();
        data.append('picture', input.files[0]);
        this.http
          .post('https://cco-backend.herokuapp.com/picture', data, {
            headers: {
              Authorization: localStorage.getItem('Authorization') as string,
            },
            responseType: 'text',
          })
          .subscribe({
            next: () => this.loadPicture(this.image),
            error: ({ error }) => console.error(error),
          });
      }
    };
  }
}
