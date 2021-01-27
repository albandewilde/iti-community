import { Component, OnInit, ViewChild } from '@angular/core';
import { AnyNotification } from 'src/modules/notification/notification.model';
import { NotificationQueries } from 'src/modules/notification/services/notification.queries';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
import { WebsocketConnection } from 'src/modules/common/WebsocketConnection';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { NotificationSocketService } from 'src/modules/notification/services/notification.socket.service';
import { NotificationStore } from 'src/modules/notification/notification.store';
import { NzNotificationService } from 'ng-zorro-antd/notification'

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit {

  showDrawer: boolean = false;
  public notifications: Array<AnyNotification>;
  public hasUnreadNotification: boolean;
    
  constructor(
    private _notificationService: NotificationService, 
    private _notificationSocketService: NotificationSocketService,
    private socket: WebsocketConnection, 
    private authStore: AuthenticationStore,
    private _notificationStore: NotificationStore,
    private _nzNotification: NzNotificationService) {

    this.hasUnreadNotification = false;
  }

  async ngOnInit(): Promise<void> {
    await this._notificationService.fetch();

    this._notificationSocketService.onNewNotification( async (notif) => {
      await this._notificationService.fetch();
      this._notificationStore.appendNotification( notif );
      this.createNotif( notif );
    } );
    
    this._notificationStore.value$.subscribe( state => {
      this.notifications = state.notifications;
    });

    this.authStore.value$.subscribe(s => {
      if (s) {
        this.socket.connect(s.accessToken);
      } else {
        this.socket.disconnect();
      }
    });
  }

  createNotif( notification: AnyNotification ) {
    if( notification.subject === "new_user" ) {
      this._nzNotification.info('Nouvel arrivant', `${notification.payload.user.username} a rejoint la plateforme !`);
    } else if( notification.subject === "post_liked" ) {
      this._nzNotification.info('Nouveau like', `${notification.payload.user.username} a aimé le message suivant : ${notification.payload.preview}`);
    } else {
      this._nzNotification.info('Nouvel arrivant', `${notification.payload.user.username} a créé une nouvelle room : ${notification.payload.room.name}`);
    }
  }

  onToggleNotifications() {
    this.showDrawer = !this.showDrawer;
    
    if( !this.showDrawer ) {
      this._notificationService.markAsViewed();
    }
  }
}
