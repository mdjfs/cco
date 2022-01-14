import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface User {
  username: string;
  password: string;
  id: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
@Injectable()
export class LoginComponent implements OnInit {
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  getUserData(callback: (user: User) => void) {
    this.http
      .get('https://cco-backend.herokuapp.com/user', {
        headers: {
          Authorization: localStorage.getItem('Authorization') as string,
        },
      })
      .subscribe({
        next: (user) => callback(user as User),
        error: ({ error }) => console.error(error),
      });
  }

  submit(token: string) {
    this.error = '';
    localStorage.setItem('Authorization', token);
    this.getUserData((user) => {
      localStorage.setItem('user-id', user.id.toString());
      localStorage.setItem('user-username', user.username);
      this.router.navigate(['/products']);
    });
  }

  register(username: string, password: string) {
    this.http
      .post(
        'https://cco-backend.herokuapp.com/user',
        {
          username,
          password,
        },
        { responseType: 'text' }
      )
      .subscribe({
        next: (token) => {
          if (!token) {
            this.error = 'Usuario ya existe, por favor elija otro nombre';
          } else {
            this.submit(token);
          }
        },
        error: ({ error }) => {
          if (error === 'Validation error') {
            this.error = 'Usuario ya existe, por favor elija otro nombre';
          } else {
            this.error = error;
          }
        },
      });
  }

  login(username: string, password: string) {
    this.http
      .post(
        'https://cco-backend.herokuapp.com/login',
        {
          username,
          password,
        },
        { responseType: 'text' }
      )
      .subscribe({
        next: (token) => {
          if (!token) {
            this.error = 'Credenciales invalidas. Registrando usuario...';
            this.register(username, password);
          } else {
            this.submit(token);
          }
        },
        error: ({ error }) => {
          console.error(error);
          this.error = error;
        },
      });
  }
}
