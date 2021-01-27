import { Component, OnInit, ViewChild } from '@angular/core';
import { AnyNotification } from 'src/modules/notification/notification.model';
import { NotificationQueries } from 'src/modules/notification/services/notification.queries';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
import { WebsocketConnection } from 'src/modules/common/WebsocketConnection';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit {

  showDrawer: boolean = false;
  public notifications: Array<AnyNotification>;
  public hasUnreadNotification: boolean;
    
  constructor(private _notificationQueries: NotificationQueries, private socket: WebsocketConnection, private authStore: AuthenticationStore) {
    this.notifications = [];
    this.hasUnreadNotification = false;
  }

  async ngOnInit(): Promise<void> {
    this.notifications = await this._notificationQueries.getNotifications();
    this.authStore.value$.subscribe(s => {
      if (s) {
        this.socket.connect(s.accessToken);
      } else {
        this.socket.disconnect();
      }
    });
  }

  onToggleNotifications() {
    this.showDrawer = !this.showDrawer;
  }
}
