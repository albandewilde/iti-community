import { Injectable } from '@angular/core';
import { PostData } from '../post.model';
@Injectable()
export abstract class PostCommands {
  abstract create(roomId: string, message: string, file?: File): Promise<PostData>;
  abstract comment(postId: string, comment: string): Promise<void>;
  abstract like(roomId: string, postId: string): Promise<void>;
}
