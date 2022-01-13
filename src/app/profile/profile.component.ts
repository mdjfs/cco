import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  menuStatus: string = '';

  constructor() {}

  ngOnInit(): void {}

  openMenu(): void {
    this.menuStatus = 'open';
  }

  closeMenu(): void {
    this.menuStatus = '';
  }
}
