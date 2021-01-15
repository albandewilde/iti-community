import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/modules/authentication/services/authentication.service';
import { UserService } from '../../services/user.service';
import { User } from '../../user.model';
import { UserStore } from '../../user.store';

@Component({
  selector: 'app-user-widget',
  templateUrl: './user-widget.component.html',
  styleUrls: ['./user-widget.component.less']
})
export class UserWidgetComponent implements OnInit {
  @Output()
  toggleNotifications: EventEmitter<void> = new EventEmitter();

  user$: Observable<User | undefined>;

  constructor(
    private _authService: AuthenticationService,
    private _router: Router,
    private modalService: NzModalService,
    private userService: UserService,
    private store: UserStore
  ) {
    this.user$ = store.user$;
  }

  ngOnInit(): void {
  }

  fireToggleNotificaions() {
    this.toggleNotifications.emit();
  }

  logout() {
    this.modalService.confirm({
      nzTitle: "Déconnexion",
      nzContent: "Êtes-vous sûr(e) de vouloir déconnecter votre session ?",
      nzOkText: "Déconnexion",
      nzOnOk: () => {
        this._authService.logout()
        this._router.navigate(["/splash/login"])
      }
    });
  }
}
