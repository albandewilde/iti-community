import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnyNotification } from 'src/modules/notification/notification.model';
import { UserQueries } from '../../services/user.queries';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UserNotificationComponent implements OnInit {
  @Input()
  notification: AnyNotification;

  public photo: SafeResourceUrl;

  constructor(
    private _userQueries: UserQueries,
    private _sanitizer: DomSanitizer,
  ) { 
  }

  async ngOnInit(): Promise<void> {
    if( this.notification.data.user.id !== "" ) {
      const userPicture = (await this._userQueries.getUser( this.notification.data.user.id ) ).photoUrl!;
      this.photo = this._sanitizer.bypassSecurityTrustResourceUrl(userPicture);
    }
  }
}
