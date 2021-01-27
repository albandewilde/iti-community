import { not } from "@angular/compiler/src/output/output_ast";
import { Injectable } from "@angular/core";
import { NotificationStore } from "../notification.store";
import { NotificationCommands } from "./notification.commands";
import { NotificationQueries } from "./notification.queries";

@Injectable()
export class NotificationService {
  constructor(
    private store: NotificationStore,
    private notificationQueries: NotificationQueries,
    private notificationCommands: NotificationCommands

  ) {
  }

  async fetch() {
    let notifications = await this.notificationQueries.getNotifications();
    notifications = notifications.reverse();
    this.store.mutate(s => {
      return {
        ...s,
        notifications
      }
    });
  }

  async markAsViewed() {
    await this.notificationCommands.view();
    await this.fetch();
  }

}
