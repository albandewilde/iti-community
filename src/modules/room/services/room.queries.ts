import { Room } from '../room.model';

export abstract class RoomQueries {
    abstract getAll(): Promise<Room[]>;
    abstract getRoomIdByPostId(postId: string): Promise<{roomId: string}>;
}