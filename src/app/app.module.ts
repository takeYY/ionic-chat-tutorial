import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AuthGuard } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { Injectable } from '@angular/core';

import { getApp, provideFirebaseApp, initializeApp } from '@angular/fire/app';
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  provideAuth,
} from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';

@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    const mc = new (window as any).Hammer(element);
    for (const eventName of Object.keys(this.overrides)) {
      mc.get(eventName).set(this.overrides[eventName]);
    }
    return mc;
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      if (Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence,
        });
      } else {
        return getAuth();
      }
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuard,
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
