import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Validator } from '@angular/forms';
import { NzMessageService } from "ng-zorro-antd/message";
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Bad, Ok } from 'src/modules/common/Result';
import { LocalUserQueries } from '../../services/platform/local/user.queries.local';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.less']
})
export class UserRegistrationComponent implements OnInit {
  public registerForm: FormGroup;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _nzMessageService: NzMessageService,
    private _userQueries: LocalUserQueries
  ) {
    this.registerForm = this._formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      pwdVal: ["", [Validators.required]]
    });
  }

  ngOnInit(): void {
  }


  async submit(): Promise<void> {

    // Check form validtion and password consistent
    if (this.registerForm.valid && this.registerForm.get("password")!.value === this.registerForm.get("pwdVal")!.value) {
      if ( this._userQueries.exists( this.registerForm.get("username")!.value ) ) {
        this._nzMessageService.error("Le nom d'utilisateur est déjà utilisé");
      } else {
        // Register the user
        if ((await this.register()).success) {
          this.goToLogin();
        } else {
          this._nzMessageService.error("Une erreur est survenue. Veuillez réessayer plus tard");
        }
      }
    } else {
      this._nzMessageService.error("Formulaire invalide !")
    }
  }

  async register(): Promise<Bad<"cant_register"> | Ok>{
    if (!this.registerForm.valid) {
      return Bad("cant_register");
    }

    try {
      const rep = await this._userService.register(
        this.registerForm.get("username")!.value,
        this.registerForm.get("password")!.value
      )
      return Ok()
    } catch(e) {
      return Bad("cant_register")
    }
  }

  goToLogin() {
    this._router.navigate(["/splash/login"])
  }
}
