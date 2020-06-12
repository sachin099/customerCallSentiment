import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { FileUploadService } from '../file-upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  progressBarWidth;
  message: string = "Uploading"
  uploadResponse: any = {};
  batchData: any = [];
  todayData: any;
  summary:any= {};
  @ViewChild('myModal', { static: true }) myModal;

  constructor(private _api: AppService, private router: Router, private _fileService: FileUploadService) {
    //console.log(this.progressBarWidth);
    if (!this._api.isUserLoggedIn) {
      this.router.navigateByUrl('/login')
    }
    this._fileService.progressBarSubject.subscribe(data => {
      this.progressBarWidth = data;
      if (this.progressBarWidth == 0) {
        this.message = " Upload File"
      } else {
        this.message = this.progressBarWidth + "%"
      }
      if (this.progressBarWidth == 100) {
        setTimeout(() => {
          window.confirm("Successfully Uploaded");
          //this.ngOnInit();
          this.reloadPage();
        }, 1000);

      }
    })
    this._api.getData("http://localhost:3000/v1/stats/todayAll").subscribe(data => {
      this.batchData = data;
    })
    this._api.getData('http://localhost:3000/v1/stats/today').subscribe(data => {
      this.todayData = data;
    })
    this._api.getData('http://localhost:3000/v1/stats/summary').subscribe(data => {
      this.summary = data;
      console.log(this.summary);
    })

  }

  reloadPage() {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigateByUrl('')
    window.location.reload()
  }
  fileList: any[] = [];
  apiUrl = this._api.getUrl();
  ngOnInit() {
    // this.progressBarWidth = 0;
    // this.message = " Upload File"
    // this._api.getData("http://localhost:3000/v1/stats/todayAll").subscribe(data => {
    //   this.batchData = data;
    // })
  }
  handleClose() {
    console.log("closed");
    this.myModal.nativeElement.className = "modal hide";
  }
  openWorkList() {
    this.router.navigateByUrl('/worklist');
  }
  handleChartEvent(event, type) {
    if (type == 'PROGRESS') {
      console.log(event);
      this.router.navigateByUrl('/worklist');
    }
  }
  handleFileInput(event) {
    this.fileList = []
    if (event.target.files.length != 0) {
      Object.keys(event.target.files).forEach(i => {
        this.fileList.push(event.target.files.item(i))
      })
    }
    //this._fileService.uploadActivity(this.fileList);
    // this._fileService.uploadActivity(this.fileList).subscribe(data => {
    //   if (data['type'] == 'progress') {
    //     this.progressBarWidth = data['payload']
    //   }
    // });
    this._fileService.uploadActivity(this.fileList);

  }
}
