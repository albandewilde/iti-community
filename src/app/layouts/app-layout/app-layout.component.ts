import { Component, OnInit, ViewChild } from '@angular/core';
import { AnyNotification } from 'src/modules/notification/notification.model';
import { NotificationQueries } from 'src/modules/notification/services/notification.queries';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit {

  showDrawer: boolean = false;
  public notifications: Array<AnyNotification>;
  public hasUnreadNotification: boolean;
    
  constructor(private _notificationQueries: NotificationQueries) {
    this.notifications = [];
    this.hasUnreadNotification = false;
  }

  async ngOnInit(): Promise<void> {
    this.notifications = await this._notificationQueries.getNotifications();
  }

  onToggleNotifications() {
    this.showDrawer = !this.showDrawer;
  }
}
