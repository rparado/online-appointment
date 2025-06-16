import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private storage = inject(Storage);
    private _storage: Storage | null = null;
    private storageUpdated = new Subject<void>();

    storageUpdated$ = this.storageUpdated.asObservable();

    /**
     * Initializes the storage service. If a custom driver is needed, define it here.
     * The service will not be ready until this method has been called.
     */
    async init() {
        const storage = await this.storage.create();
        this._storage = storage;
    }

    public async set(key: string, value: any): Promise<any> {
        if (!this._storage) return Promise.reject('Storage not initialized');

        const result = await this._storage.set(key, value);
        this.storageUpdated.next();
        return result;
    }

    public async get(key: string): Promise<any> {
        return this._storage?.get(key) ?? Promise.reject('Storage get error');
    }

    public async delete(key: string): Promise<any> {
        if (!this._storage) return Promise.reject('Storage not initialized');

        const result = await this._storage.remove(key);
        this.storageUpdated.next();
        return result;
    }

    public async checkFreshInstall(): Promise<boolean> {
        if (!this._storage) return Promise.reject('Storage not initialized');

        try {
            const hasOnboarded = await this._storage.get('hasOnboarded');

            if (!hasOnboarded) {
                console.log('Fresh install detected. Clearing storage.');
                await this._storage.clear();
                this.storageUpdated.next();
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error checking fresh install:', error);
            return false;
        }
    }

    public async setOnboarded(): Promise<void> {
        if (!this._storage) return Promise.reject('Storage not initialized');

        await this._storage.set('hasOnboarded', true);
        this.storageUpdated.next();
    }

    public async clearAll(): Promise<void> {
        if (!this._storage) return Promise.reject('Storage not initialized');

        await this._storage.clear();
        this.storageUpdated.next();
    }
}
