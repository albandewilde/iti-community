import { Injectable } from '@angular/core';

@Injectable()
export abstract class PostCommands {
    abstract create(roomId: string, message: string, file?: File): Promise<{ id: string }>;
    abstract comment(postId: string, comment: string): Promise<void>;
    abstract like(roomId: string, postId: string, liked: boolean): Promise<void>;
}
