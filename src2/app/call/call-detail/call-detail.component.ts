import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'call-detail',
    templateUrl: './call-detail.component.html',
    styleUrls: ['./call-detail.component.css']
})
export class CallDetail implements OnInit {

    call: Object = {};
    updateObj = { 'remarks': '', _id: '' };
    constructor(private route: ActivatedRoute, private _api: AppService, private router: Router, private location: Location) {
    }

    handleClick() {
        console.log(this.updateObj)
        this._api.postData("http://localhost:3000/v1/callMaster/updateStatus", this.updateObj).subscribe(data => {
            if (data) {
                console.log(data);
                sessionStorage.setItem("call", JSON.stringify(data));
                //this.location.back();
                this.reloadPage()
            }
        })
    }
    reloadPage() {
        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        // this.router.onSameUrlNavigation = 'reload';
        //this.router.navigateByUrl('worklist')
        window.location.reload();
    }
    ngOnInit() {
        this.call = JSON.parse(sessionStorage.getItem('call'));
        this.updateObj['_id'] = this.call['_id']
        // var count = $(('#count'));
        // $({ Counter: 0 }).animate({ Counter: count.text() }, {
        //     duration: 5000,
        //     easing: 'linear',
        //     step: function () {
        //         count.text(Math.ceil(this.Counter) + "%");
        //     }
        // });

        // var s = Snap('#animated');
        // var progress = s.select('#progress');

        // progress.attr({ strokeDasharray: '0, 251.2' });
        // Snap.animate(0, 251.2, function (value) {
        //     progress.attr({ 'stroke-dasharray': value + ',251.2' });
        // }, 5000);
    }
}
