import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserQueries } from 'src/modules/user/services/user.queries';
import { Room } from '../../room.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room-create-modal',
  templateUrl: './room-create-modal.component.html',
  styleUrls: ['./room-create-modal.component.less']
})
export class RoomCreateModalComponent implements OnInit {
  public roomFormGroup: FormGroup;
  public isVisible: boolean = false;

  constructor(
    private _roomService: RoomService, 
    private _formBuilder: FormBuilder,
    private _userQueries: UserQueries
  ) {
    
  }

  ngOnInit(): void {
    this.roomFormGroup = this._formBuilder.group({
      type: ['text', [Validators.required]],
      roomName: ['', [Validators.required]]
    });
  }

  async onOk() {
    if (this.roomFormGroup.valid) {
      this._roomService.create(this.roomFormGroup.get('roomName')!.value, this.roomFormGroup.get('type')!.value).then( (room) => {
        if( room ) {
          this._roomService.setShouldFetchRooms( true );
          this.close();
        }
      });
    }
  }

  onCancel() {
    this.close();
  }

  open() {
    this.roomFormGroup.reset({ type: 'text', roomName: '' });
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
