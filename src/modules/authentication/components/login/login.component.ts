import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from "ng-zorro-antd/message";
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private _router: Router,
    private _authService: AuthenticationService,
    private _nzMessageService: NzMessageService,
    private _formBuilder: FormBuilder
  ) { 
    this.loginForm = this._formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  goToRegistration() {
    this._router.navigate(["/splash/register"])
  }

  submit() {
    this.login();
  }

  async login() {
    if (!this.loginForm.valid) {
      return;
    }

    try {
      const response = await this._authService.authenticate(this.loginForm.get("username")!.value, this.loginForm.get("password")!.value);
      if( response.success ) {
        this._router.navigate(["/"]);
      } else {
        this._nzMessageService.error("Une erreur est survenue lors de l'authentification !");
      }
    } catch (e) {
      this._nzMessageService.error("Une erreur est survenue. Veuillez réessayer plus tard");
    }
  }
}
