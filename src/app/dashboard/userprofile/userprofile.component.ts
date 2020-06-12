import { Component, OnInit } from '@angular/core'
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'dashboard-userprofile',
    templateUrl: './userprofile.component.html',
    styleUrls: ['userprofile.component.css']
})
export class DashboardUserProfileComponent implements OnInit {
    columns: any = ['']
    screen: string = 'MAIN'
    userData: Object;

    constructor(private _api: AppService) {

    }
    user: any = {
        name: "",
        soeid: "",
        admin: "",
        roles: "",
        functionalities:"",
        status:"",
        createdDate:""
    }

    goToScreen(event) {
        if (event == 'ADD') {
            this.screen = 'ADD'
        }

    }
    handleChange(event, id, index) {
        //console.log(this.functionality)
    }
    ngOnInit() {
        this._api.getData("http://localhost:3000/v1/stats/user").subscribe(data => {
      this.userData = data;
      console.log(this.userData);
    })
        this.screen = 'MAIN'


    }

    cancel() {
        this.screen = 'MAIN'
    }

    save() {

        this._api.postData(this._api.getUrl() + '/v1/user/addUser', this.user).subscribe(data => {
            console.log(data);
        })
        this.ngOnInit();
    }

}