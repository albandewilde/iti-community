import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Post } from '../../post.model';
import { PostService } from '../../services/post.service';
import { DateTime } from 'luxon';
import { UserQueries } from 'src/modules/user/services/user.queries';

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

  @ViewChild("anchor")
  anchor: ElementRef<HTMLDivElement>;

  constructor(
    private _postService: PostService,
    private _userQueries: UserQueries
  ) { 
  }

  async ngOnInit(): Promise<void> {
    this.postDate = DateTime.fromISO( this.post.createdAt as string ).toLocal().toRelative() as string;
    this.profilePicture = (await this._userQueries.getUser( this.post.createdBy.id )).photoUrl;
  }

  ngAfterViewInit() {
    this.anchor.nativeElement.scrollIntoView();
  }

  async like() {
    this._postService.like( this.post, !this.post.liked );
    this.post.liked = !this.post.liked;

    // TO DO : send PostLikedNotification 
  }
}
