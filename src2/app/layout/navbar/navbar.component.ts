import { Component } from '@angular/core'
import { AppService } from 'src/app/app.service'
import { Router } from '@angular/router'

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    constructor(private _api: AppService, private router: Router) {
        if (!this._api.isUserLoggedIn) {
            this.router.navigateByUrl('/login')
        }

    }
    handleClick(event) {
        if(event == 'configuration'){
            this.router.navigateByUrl('/configuration');
        }else{
            this.router.navigateByUrl('/upload');
        }
        
    }
    logout() {
        this._api.setKey = null;
    }
}