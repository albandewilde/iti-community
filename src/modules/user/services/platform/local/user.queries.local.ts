import { Injectable } from '@angular/core';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
import { User, UserRegistration } from 'src/modules/user/user.model';
import { UserQueries } from '../../user.queries';
import { UserLocalStorage } from './user.storage';

@Injectable()
export class LocalUserQueries extends UserQueries {

    private storage: UserLocalStorage = new UserLocalStorage();

    constructor(private authStore: AuthenticationStore) {
        super();
    }

    async getUserInfo(): Promise<User> {
        if (!this.authStore.value) {
            throw new Error("User not logged in");
        }

        const users = this.storage.getValue();
        const user = users[this.authStore.value.userId]
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    getAllUsers(): Array<User> {
        const users = this.storage.getValue();
        return Object.keys(users)
        .map(id => {
            return {
                id,
                username: users[id].username
            }
        });
    }

    async getUser( userId: string ): Promise<User> {
        const users = this.storage.getValue();
        const user = users[userId];

        return user;
    }

    getAllUsers(): Array<User> {
        const users = this.storage.getValue();
        return Object.keys(users)
            .map(id => {
                return {
                    id,
                    username: users[id].username
                }
            });
    }

    async search(search: string): Promise<User[]> {
        const users = this.storage.getValue();
        return Object.keys(users)
        .map(id => {
            return {
                id,
                username: users[id].username
            }
        })
        .filter(user => user.username.toLowerCase().startsWith(search.toLowerCase()));
    }


    async exists(username: string): Promise<boolean> {
        const users = this.storage.getValue();
        return Object.keys(users).some(id => users[id].username === username);
    }

}
