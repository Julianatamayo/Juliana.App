import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {

  form = new FormGroup ({
    email: new FormControl ('',[Validators.required, Validators.email]),
    password: new FormControl ('',[Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$')]),
    name: new FormControl ('',[Validators.required]),
    lastname: new FormControl ('',[Validators.required]),
    phone: new FormControl ('',[Validators.required]),
  });
  
  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const { email, password, name, lastname, phone } = this.form.value;
      const userInfo = { name, lastname, phone }; // Objeto de información del usuario
      const loading = await this.utilsSvc.loading();
      await loading.present();
      this.firebaseSvc.SignUp(email, password, userInfo).then(async res => {
        await this.firebaseSvc.SetUserData(this.form.value.name);
        console.log(res);
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
      
    }
  }

}
