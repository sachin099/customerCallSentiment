import { Component, OnInit } from '@angular/core';
import { LoginRequest } from './login.model'
import { AppService } from '../app.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _api: AppService, private router: Router) { }
  request: LoginRequest = new LoginRequest();
  ngOnInit() {
  }

  login() {
    // this._api.postData(this._api.getUrl() + '/login', this.request).subscribe(data => {
    //   this._api.setKey(data['key'])
    //   this.router.navigateByUrl('/')
    // },
    //   (err) => {
    //     console.log("nbifnd")
    //   })
    this.router.navigateByUrl('/')
    
  }

}
