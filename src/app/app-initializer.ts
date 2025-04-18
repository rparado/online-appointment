// Purpose: App Initializer function to be called before the app starts to initialize the app with the necessary data.
import { StorageService } from '@oda/core/services/storage/storage.service';

export function AppInitializer(storage: StorageService) {
    return (): Promise<any> => {
        return new Promise<void>(async (resolve) => {
            await storage.init();
            await storage.checkFreshInstall();
            resolve();
        });
    };
}
