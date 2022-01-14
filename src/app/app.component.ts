import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-cco';

  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('Authorization'))
      this.router.navigate(['/login']);
  }
}
