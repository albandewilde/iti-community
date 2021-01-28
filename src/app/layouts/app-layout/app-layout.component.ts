import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
import { WebsocketConnection } from 'src/modules/common/WebsocketConnection';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit {


  showDrawer: boolean = false;
  constructor(private socket: WebsocketConnection, private authStore: AuthenticationStore) {
  }

  ngOnInit(): void {
    this.authStore.value$.subscribe(s => {
      if (s) {
        this.socket.connect(s.accessToken);
      } else {
        this.socket.disconnect();
      }
    });
  }

  onToggleNotifications() {

  }
}
