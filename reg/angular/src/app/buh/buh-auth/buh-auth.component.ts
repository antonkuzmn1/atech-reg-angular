import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputDirective } from '../../input.directive';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-buh-auth',
  standalone: true,
  imports: [
    FormsModule,
    InputDirective,
    NgIf,
  ],
  templateUrl: './buh-auth.component.html',
  styleUrl: './buh-auth.component.scss'
})
export class BuhAuthComponent implements OnInit {

  constructor(
    private session: SessionService,
  ) { }
  login: string = "";
  password: string = "";

  ngOnInit(): void {
    this.session.get()
  }

  allow(): boolean {
    return this.session.groups.some(id =>
      id === 1 ||
      id === 2);
  }

  auth(): void {
    this.session.auth({ login: this.login, password: this.password })
  }

  logout(): void {
    this.session.logout()
  }

}