import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Post } from '../../post.model';
import { PostService } from '../../services/post.service';
import { DateTime } from 'luxon';
import { UserQueries } from 'src/modules/user/services/user.queries';
import { Router } from '@angular/router';
import { NotificationPushService } from 'src/modules/notification/notification-push.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit, AfterViewInit {
  @Input()
  post: Post;
  public postDate: string;
  public profilePicture: string | undefined;
  public shouldHighlight: boolean;

  @ViewChild("anchor")
  anchor: ElementRef<HTMLDivElement>;

  constructor(
    private _postService: PostService,
    private _userQueries: UserQueries,
    private _notificationPush: NotificationPushService
  ) { 
    this.shouldHighlight = false;
  }

  async ngOnInit(): Promise<void> {
    this.postDate = DateTime.fromISO( this.post.createdAt as string ).toLocal().toRelative() as string;
    const userPicture = (await this._userQueries.getUserById( this.post.createdBy.id ))!.photoUrl;

    if( userPicture?.endsWith("null")) {
      this.profilePicture = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg";
    } else {
      this.profilePicture = userPicture;
    }

    this._notificationPush.shoudHighLightPost$.pipe(filter( id => id !== '')).subscribe((postId) => {
      if( postId === this.post.id ) {
        this.shouldHighlight = true;
      }
    });
  }

  ngAfterViewInit() {
    this.anchor.nativeElement.scrollIntoView();
  }

  async like() {
    this._postService.like( this.post );
    this.post.liked = !this.post.liked;
  }
}
