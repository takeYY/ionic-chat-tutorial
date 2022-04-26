import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { FirestoreService } from '../shared/firestore.service';
import { ProfilePage } from '../shared/profile/profile.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  message = '';
  constructor(
    public modalController: ModalController,
    public auth: AuthService,
    public firestore: FirestoreService
  ) {}

  async ngOnInit() {
    const user = await this.firestore.userInit(await this.auth.getUserId());
    if (!user) {
      const modal = await this.modalController.create({
        component: ProfilePage,
      });
      await modal.present();
    }
  }
}
