import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  uid: string;
  user = {
    displayName: null,
    photoDataUrl: null,
  };
  photo: string;

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  modalDismiss() {
    this.modalController.dismiss();
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.Uri,
    });

    this.photo = image && image.dataUrl;
  }
}