import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AnyNotification } from './notification.model';

@Injectable()
export class NotificationPushService {
  private shouldHighlightPost: BehaviorSubject<string>;
  public shoudHighLightPost$: Observable<string>;

  public permission: NotificationPermission;

  constructor( private _router: Router ) { 
    this.shouldHighlightPost = new BehaviorSubject<string>( '' );
    this.shoudHighLightPost$ = this.shouldHighlightPost.asObservable();

    this.permission = this.canNotify() ? 'default' : 'denied';

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'visible') {
        this.permission = this.canNotify() ? 'default' : 'denied';
      } else {
        this.permission = 'denied';
      }
    });
  }

  canNotify(): boolean {
    return 'Notification' in window;
  }

  requestPermission(): void {
    if( this.permission !== 'denied' ) {
      Notification.requestPermission( (status: NotificationPermission) => {
        this.permission = status;
      });
    }
  }

  create(title: string, option: NotificationOptions) {
    return new Observable(( obs ) => {
      if( !this.canNotify() || this.permission !== 'granted' ) {
        obs.complete();
      }

      const notif = new Notification(title, option);
      notif.onshow = (e) => {
        return obs.next({
          notification: notif,
          event: e
        });
      };

      notif.onclick = async (e) => {
        if( notif.title === 'Nouvelle room' ) {
          this._router.navigate(['app', `${notif.data.roomId}`]);
        } else if( notif.title === 'Nouveau like' ) {
          console.log(notif)
          this.shouldHighlightPost.next( notif.data.postId );
          this._router.navigate(['app', `${notif.data.roomId}`]);
        }

        return obs.next({
          notification: notif,
          event: e
        });
      };
      
      notif.onerror = (e) => {
        return obs.error({
          notification: notif,
          event: e
        });
      };

      notif.onclose = () => {
        return obs.complete();
      }
    });
  }

  generateNotifications( options: Array<PushNotificationOptions> ): void {
    options.forEach( (o) => {
      const option: NotificationOptions = {
        icon: o.notif.payload.user.photoUrl,
        body: o.body,
        data: o.data
      };
      this.create( o.title, option ).subscribe();
    });
  }

  setShouldHighlight( postId: string ) {
    this.shouldHighlightPost.next( postId );
  }
}

export interface PushNotificationOptions {
  notif: AnyNotification;
  title: string;
  body: string;
  data: {
    roomId?: string;
    postId?: string;
  }
}