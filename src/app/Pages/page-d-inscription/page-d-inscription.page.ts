import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-page-d-inscription',
  templateUrl: './page-d-inscription.page.html',
  styleUrls: ['./page-d-inscription.page.scss'],
})
export class PageDInscriptionPage implements OnInit {

  regForm: FormGroup;

  constructor(public formBuilder:FormBuilder, public loadingCtrl: LoadingController, public authService:AuthentificationService, public router: Router) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({

      fullname: ['', [Validators.required]],
    
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],
  
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]]

    })
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async signUp(){
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if(this.regForm?.valid){
      const user = await this.authService.registerUser(this.regForm.value.email, this.regForm.value.password).catch((error) =>{
        console.log(error);
        loading.dismiss()
      })

      if(user){
        loading.dismiss()
        this.router.navigate(['/tabs/tab1'])
      } else{
        console.log('Veuillez entrer des valeurs correctes');
      }
    }
  }
  

}
