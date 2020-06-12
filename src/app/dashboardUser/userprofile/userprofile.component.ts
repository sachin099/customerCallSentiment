import { Component, OnInit } from '@angular/core'
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'dashboard-userprofile',
    templateUrl: './userprofile.component.html',
    styleUrls:['userprofile.component.css']
})
export class DashboardUserProfileComponent implements OnInit {
    columns: any = ['']
    screen: string = 'MAIN'
    functionality: any = {
        generic: [],
        "createdBy": 'Admin',
        "updatedBy": "",
        "createdDate": Date.now(),
        "status": "Active",
        "updatedDate": ""
    }
    functionalities: any = []
    genericList: any = [];
    customList: any = [];
    checklistCategory = []
    selectedFunctionality: any = null;

    constructor(private _api: AppService) {

    }
    selectFunctionality(event, index) {
        this.selectedFunctionality = this.functionalities[index];
        //console.log(index, this.selectedFunctionality)
    }
    goToScreen(event) {
        if (event == 'ADD') {
            this.screen = 'ADD'
        } else if (event == 'VIEW') {
            if(this.selectedFunctionality!=null){
                this.screen = 'VIEW'
            }else{
                window.alert("Please select the row.")
            }
            
        } else if (event == 'UPDATE') {
            if(this.selectedFunctionality!=null){
                this.screen = 'UPDATE'
            }else{
                window.alert("Please select the row to update.")
            }
            
        } else {
            this.screen = 'MAIN'
        }

    }
    handleChange(event, id, index) {
        //console.log(event.target.checked, index)
        if (event.target.checked) {
            this.functionality['generic'].push(this.genericList[index]);
        } else {
            let tempArr = this.functionality['generic'];
            this.functionality['generic'] = [];
            tempArr.forEach(item => {
                if (item['id'] != id) {
                    this.functionality['generic'].push(item);
                }
            });
        }
        //console.log(this.functionality)
    }
    ngOnInit() {
        this.screen = 'MAIN'
        this._api.getData('assets/staticData.json').subscribe(data => {
            this.genericList = data['genericList'];
            this.genericList.forEach(item => {
                item['weight'] = ""
            })
            this.checklistCategory = data['checklistCategory']
        })
        this._api.getData(this._api.getUrl() + '/getFunctionality').subscribe(data => {
            this.functionalities = data;
            console.log(data);
        })
    }
    getSelectedDropdown(val) {
        console.log(val);
    }
    pushCustom() {
        let obj = {
            'name': '',
            'category': '',
            'weight': ''
        };
        this.customList.push(obj)
    }

    cancel() {
        this.screen = 'MAIN'
    }

    save() {
        this.functionality['custom'] = this.customList;
        console.log(this.functionality);
        this._api.postData(this._api.getUrl() + '/addFunctionality', this.functionality).subscribe(data => {
            console.log(data);
        })
        this.ngOnInit();
    }
    deleteItem(index) {
        this.customList.splice(index, 1);
    }
}