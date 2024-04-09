import { User } from './../model/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private utils : UtilsService,
  
  ) {}

  SignUp(email: string, password: string, userInfo: any) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SendVerificationMail();
        this.SetUserData(result.user, userInfo);
        this.router.navigate(['login']);
        this.utils.presentToast({ message: '¡Registro exitoso!', duration: 2500, color: 'success' });
      })
      .catch((error) => {
        console.log(error.message);
        if (error.message === 'Firebase: The email address is already in use by another account') {
          this.utils.presentToast({ message: 'Este correo ya se encuentra registrado', duration: 2500, color: 'danger' });
        }
      });
  }

  SendVerificationMail() {
    return this.auth.currentUser.then((u: any) => u.sendEmailVerification());
  }

  SetUserData(user: any, userInfo?: any) {
    const userRef: any = this.firestore.doc(`users/${user.uid}`);
    const userData: any = {
      uid: user.uid,
      email: user.email,
      identificacion: userInfo.identificacion,
      name: userInfo.name,
      apellido: userInfo.apellido,
      telefono: userInfo.telefono,
      password: userInfo.password,
      // rol: userInfo.rol,
    };
    return userRef.set(userData, { merge: true });
  }

  SignIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.auth.authState.subscribe((user: any) => {
          localStorage.setItem('uid', user.uid);
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      });
  }

  SignOut() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    });
  }

}

