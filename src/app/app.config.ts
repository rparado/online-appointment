import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer } from "@angular/core";
import { IonicStorageModule } from "@ionic/storage-angular";
import { Drivers } from '@ionic/storage';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { AuthTokenInvalidInterceptor } from "./interceptors/auth.token.invalid.interceptor";
import { AuthTokenInterceptor } from "./interceptors/auth.token.interceptor";
//import { ApiErrorMessageInterceptor } from "./interceptors/api.error.message.interceptor";
import { AppInitializer } from "./app-initializer";
import { StorageService } from "@oda/core/services/storage/storage.service";
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withInMemoryScrolling, withPreloading } from "@angular/router";
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

const EnvironmentConfig = importProvidersFrom([
    IonicStorageModule.forRoot({
        name: '__appointmentappdb',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
    }),
]);

export const AppConfig: ApplicationConfig = {
    providers: [
        EnvironmentConfig,
        provideAnimations(),
        provideIonicAngular({
            mode: 'ios',
            rippleEffect: false,
            useSetInputAPI: true, //allow to use signal input in modals
        }),
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(
            routes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
        ),
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy,
        },
        provideAppInitializer(() => {
            const initializerFn = AppInitializer(inject(StorageService));
            return initializerFn();
        }),
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: ApiErrorMessageInterceptor,
        //     multi: true,
        // },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthTokenInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthTokenInvalidInterceptor,
            multi: true,
        },
    ],
}


