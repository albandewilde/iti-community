import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/modules/authentication/services/authentication.service';
import { Bad, Ok } from 'src/modules/common/Result';
import { User } from '../../user.model';
import { UserStore } from '../../user.store';
import { NotificationStore } from 'src/modules/notification/notification.store';

@Component({
  selector: 'app-user-widget',
  templateUrl: './user-widget.component.html',
  styleUrls: ['./user-widget.component.less']
})
export class UserWidgetComponent implements OnInit {
  @Input()
  hasUnreadNotifs: boolean;
  
  @Output()
  toggleNotifications: EventEmitter<void> = new EventEmitter();
  
  user$: Observable<User | undefined>;
  photoUrl$: Observable<string | undefined>;
  photoUrl: SafeResourceUrl;
  hasUnread$: Observable<boolean>;

  constructor(
    private _authService: AuthenticationService,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private modalService: NzModalService,
    private store: UserStore,
    private notificationStore: NotificationStore,
  ) {
    this.user$ = store.user$;
    this.photoUrl$ = store.get(s => s.user && s.user.photoUrl ? s.user.photoUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg");
    this.hasUnread$ = notificationStore.hasUnread$;
  }

  ngOnInit(): void {
    this.user$.subscribe( user => { 
      if( user?.photoUrl ) {
        this.photoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(user?.photoUrl);
      }
    });
  }

  fireToggleNotificaions() {
    this.toggleNotifications.emit();
  }

  logout() {
    this.modalService.confirm({
      nzTitle: "Déconnexion",
      nzContent: "Êtes-vous sûr(e) de vouloir déconnecter votre session ?",
      nzOkText: "Déconnexion",
      nzOnOk: async () => {
        await this._authService.logout().then( (resp: Bad<"user_not_authenticated"> | Ok) => {
          if( resp.success ) {
            this._router.navigate(['/splash/login']);
          }
        });
      }
    });
  }
}
