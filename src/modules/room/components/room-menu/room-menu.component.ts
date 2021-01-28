import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { last } from 'rxjs/operators';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room } from '../../room.model';
import { RoomStore } from '../../room.store';
import { RoomQueries } from '../../services/room.queries';
import { RoomService } from '../../services/room.service';
import { RoomSocketService } from '../../services/room.socket.service';
import { RoomCreateModalComponent } from '../room-create-modal/room-create-modal.component';

@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less']
})
export class RoomMenuComponent implements OnInit {
  @ViewChild("modal")
  modalComponent: RoomCreateModalComponent;

  private lastVisitedRoom: string;
  roomId$: Observable<string | undefined>;
  rooms: Room[];

  constructor(
    private feedStore: FeedStore,
    private queries: RoomQueries,
    private _roomService: RoomService,
    private _router: Router,
    private roomSocketService: RoomSocketService) {
    this.roomId$ = feedStore.roomId$;
    this.rooms = [];
    this.lastVisitedRoom = 'ity.lastVisitedRoom';
  }

  async ngOnInit() {
    await this.fetchRooms();

    this._roomService.shouldFetchRooms$.subscribe( async ( shouldFetch: boolean ) => {
      if( shouldFetch ) {
        await this.fetchRooms();
      }
    });

    let lastRoomId = window.localStorage.getItem( this.lastVisitedRoom );
    if( lastRoomId ) {
      this._router.navigate([`/app/${ lastRoomId }`]);
    }
  }

  async fetchRooms() {
    this.rooms = await this.queries.getAll();
  }

  goToRoom(room: Room) {
    window.localStorage.setItem( this.lastVisitedRoom, room.id.toString() );
    this._router.navigate([`/app/${room.id}`]);
  }

  openChildModal() {
    this.modalComponent.open();
  }
}
