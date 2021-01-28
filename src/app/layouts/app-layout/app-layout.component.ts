import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AnyNotification, PostLikedNotification } from 'src/modules/notification/notification.model';
import { Subscription } from 'rxjs';
import { NotificationQueries } from 'src/modules/notification/services/notification.queries';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
import { WebsocketConnection } from 'src/modules/common/WebsocketConnection';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { NotificationSocketService } from 'src/modules/notification/services/notification.socket.service';
import { NotificationStore } from 'src/modules/notification/notification.store';
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NotificationPushService, PushNotificationOptions } from 'src/modules/notification/notification-push.service';
import { RoomQueries } from 'src/modules/room/services/room.queries';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  sub?: Subscription;
  showDrawer: boolean = false;
  public notifications: Array<AnyNotification>;
  public hasUnreadNotification: boolean;
    
  constructor(
    private _notificationService: NotificationService, 
    private _notificationSocketService: NotificationSocketService,
    private socket: WebsocketConnection, 
    private authStore: AuthenticationStore,
    private _notificationStore: NotificationStore,
    private _nzNotification: NzNotificationService,
    private _notificationPush: NotificationPushService, 
    private _roomQueries: RoomQueries) {

    this.hasUnreadNotification = false;
    this._notificationPush.requestPermission();
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
    
    this.sub = this.authStore.accessToken$.subscribe(accessToken => {
      if (accessToken) {
        this.socket.connect(accessToken);
      } else {
        this.socket.disconnect();
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  
  async createNotif( notification: AnyNotification ) {
    let pushNotifOptions: Array<PushNotificationOptions> = [];

    if( notification.subject === "new_user" ) {
      this._nzNotification.info('Nouvel arrivant', `${notification.payload.user.username} a rejoint la plateforme !`);

      const o = {
        notif: notification,
        title: 'Nouvel arrivant', 
        body: `${notification.payload.user.username} a rejoint la plateforme !`,
        data: {}
      };

      pushNotifOptions.push( o );
    } else if( notification.subject === "post_liked" ) {
      this._nzNotification.info('Nouveau like', `${notification.payload.user.username} a aimé le message suivant : ${notification.payload.preview}`);
      
      const roomId = await (await this._roomQueries.getRoomIdByPostId( notification.payload.postId )).roomId;

      const o = {
        notif: notification,
        title: 'Nouveau like', 
        body: `${notification.payload.user.username} a aimé le message suivant : ${notification.payload.preview}`,
        data: { postId: notification.payload.postId, roomId: roomId }
      }

      pushNotifOptions.push( o );
    } else {
      this._nzNotification.info('Nouvelle room', `${notification.payload.user.username} a créé une nouvelle room : ${notification.payload.room.name}`);

      const o: PushNotificationOptions = {
        notif: notification,
        title: 'Nouvelle room', 
        data: { roomId: `${notification.payload.room.id}` },        
        body: `${notification.payload.user.username} a créé une nouvelle room : ${notification.payload.room.name}`
      }
      
      pushNotifOptions.push( o );
    }

    this._notificationPush.generateNotifications( pushNotifOptions );
  }

  onToggleNotifications() {
    this.showDrawer = !this.showDrawer;
    
    if( !this.showDrawer ) {
      this._notificationService.markAsViewed();
    }
  }
}
