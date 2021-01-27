import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnyNotification } from 'src/modules/notification/notification.model';
import { UserQueries } from '../../services/user.queries';
import { DateTime } from 'luxon';
import { NotificationStore } from 'src/modules/notification/notification.store';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UserNotificationComponent implements OnInit {
  @Input()
  notification: AnyNotification;

  public photo: string;
  public description: string;
  public date: string;
  public isNew: boolean;

  constructor(
    private _userQueries: UserQueries,
    private _noticationStore: NotificationStore
  ) { 
    this.isNew = true;
  }

  async ngOnInit(): Promise<void> {
    if( this.notification.subject === "new_user" ) {
      this.description = `${this.notification.payload.user.username} a rejoint la plateforme !`;
    } else {
      if( this.notification.subject === "post_liked" ) {
        this.description = `${this.notification.payload.user.username} a aimé le message suivant : ${this.notification.payload.preview}`;
      } else {
        this.description = `${this.notification.payload.user.username} a créé une nouvelle room : ${this.notification.payload.room.name}`;
      }
    }
    const photoUrl = (await this._userQueries.getUserById( this.notification.payload.user.id )).photoUrl;
    if( photoUrl && !photoUrl?.endsWith('null') ){
      this.photo = photoUrl;
    } else {
      this.photo = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg";
    }
    
    this.date = DateTime.fromMillis( this.notification.timestamp ).toRelative()!;

    this._noticationStore.value$.subscribe(state => {
      this.isNew = state.notifications.findIndex( n => !n.viewedAt && n.id === this.notification.id ) > -1;
    });
  }
}
