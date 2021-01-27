import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room } from '../../room.model';
import { RoomStore } from '../../room.store';
import { RoomQueries } from '../../services/room.queries';
import { RoomService } from '../../services/room.service';
import { RoomCreateModalComponent } from '../room-create-modal/room-create-modal.component';

@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less']
})
export class RoomMenuComponent implements OnInit {
  @ViewChild("modal")
  modalComponent: RoomCreateModalComponent;

  roomId$: Observable<string | undefined>;
  rooms: Room[];

  constructor(private feedStore: FeedStore, private queries: RoomQueries, private roomService: RoomService, private _router: Router) {
    this.roomId$ = feedStore.roomId$;
    this.rooms = [];
  }

  async ngOnInit() {
    this.rooms = await this.queries.getAll();
  }

  goToRoom(room: Room) {
    this._router.navigate([`/app/${room.id}`]);
  }

  openChildModal() {
    this.modalComponent.open();
  }
}
