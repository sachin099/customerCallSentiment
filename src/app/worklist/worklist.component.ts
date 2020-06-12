import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router, NavigationExtras } from '@angular/router';
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const EXCEL_EXTENSION = '.xlsx'

@Component({
  selector: 'app-worklist',
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.css']
})
export class WorklistComponent implements OnInit {

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
  totalPage: any;
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
      this.totalPage = Math.ceil(data[0]['totalRecords'] / 10)
    })
  }
  ngOnInit() {
    this.filters = { ...this.filters, ...this._api.getFilterData() }
    console.log(this.filters)
    this._api.postData('http://localhost:3000/v1/callMaster/filter', this.filters).subscribe(data => {
      console.log(data)
      this.list = data;
      this.totalPage = Math.ceil(data[0]['totalRecords'] / 10)
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
    let tempObj = {
      "S_no": '', "batchId": '', 'callId': '', 'uploadedOn': '', 'uploadedBy': '',
      'processedOn': '', 'processedBy': '', 'Functionality': '', 'Score': '', 'status': ''
    }
    this.list.forEach(element => {
      let obj = {};
      Object.keys(element).forEach(key => {
        if (tempObj[key] != undefined) {
          obj[key] = element[key];
        }
        if (tempObj[key] != undefined && (key == 'uploadedOn' || key == 'processedOn')) {
          if (element[key] != '') {
            obj[key] = new Date(element[key]);
          }

        }
      })
      tempdata.push(obj);
    });
    console.log(tempdata)
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tempdata);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    //FileSaver.saveAs(data, "report" + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    FileSaver.saveAs(data, "Report" + '_Export_' + new Date(Date.now()).toLocaleDateString() + EXCEL_EXTENSION);
  }

}
