import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    constructor(
      public authService : AuthService,
      public router : Router
    ) { }

    public logOut(): void
    {
      this.authService.doLogout();
    }
}
