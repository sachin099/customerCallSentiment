import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboardUser',
  templateUrl: './dashboardUser.component.html',
  styleUrls: ['./dashboardUser.component.css']
})
export class DashboardUserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

export * from './userprofile/userprofile.component';