import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router, NavigationExtras } from '@angular/router';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument/spreadsheetml.sheet;charset=UTF-8'
const EXCEL_EXTENSION = '.xlsx'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  list: any = [];
  from_date = "";
  to_date = ""
  filters: any = {
    "Functionality": '',
    'status': '',
    'batchId': '',
    'callId': '',
    "from_date": Date.parse(""),
    "to_date": Date.parse(""),
    "currentPage": 0
  };
  columns: any = [
    { 'label': 'Batch ID', 'name': 'batchId' },
    { 'label': 'Call ID', 'name': 'callId' },
    { 'label': 'Uploaded On', 'name': 'uploadedOn' },
    { 'label': 'Uploaded By', 'name': 'uploadedBy' },
    { 'label': 'Verified On', 'name': 'verifiedOn' },
    { 'label': 'Verified By', 'name': 'verifiedBy' },
    { 'label': 'Functionality', 'name': 'functionality' },
    { 'label': 'Score', 'name': 'score' },
    { 'label': 'Status', 'name': 'status' }
  ]
  constructor(private _api: AppService, private router: Router) {
    if (!this._api.isUserLoggedIn) {
      this.router.navigateByUrl('/login')
    }
  }

  search() {
    this.filters['from_date'] = Date.parse(this.from_date)
    this.filters['to_date'] = Date.parse(this.to_date)
    console.log(this.filters)
    this._api.postData('http://localhost:3000/v1/callMaster/filter', this.filters).subscribe(data => {
      console.log(data)
      this.list = data;
    })
  }
  ngOnInit() {
    this.filters = { ...this.filters, ...this._api.getFilterData() }
    // this._api.getData('http://localhost:3000/v1/callMaster').subscribe(data => {
    //   this.list = data
    //   console.log(data)
    // })
    console.log(this.filters)
    this._api.postData('http://localhost:3000/v1/callMaster/filter', this.filters).subscribe(data => {
      console.log(data)
      this.list = data;
    })
  }
  upload() {
    this.router.navigateByUrl('upload')
  }

  openCall(index) {
    console.log(this.list[index]);
    sessionStorage.setItem("call", JSON.stringify(this.list[index]))
    this.router.navigateByUrl("/calldetail")
  }
  loadPage(event) {
    this.filters['currentPage'] = parseInt(event) - 1
    this.search();
  }

  exportAsExcel() {
    let tempdata = [];
    this.list.forEach(element => {
      let obj = {};
      Object.keys(element).forEach(key => {
        if (typeof element[key] != 'object') {
          obj[key] = element[key];
        }
      })
      tempdata.push(obj);
    });
    console.log(tempdata)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tempdata);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['Report']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, "report" + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
