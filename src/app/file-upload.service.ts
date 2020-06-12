import { Injectable } from '@angular/core'
import { AppService } from './app.service'
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    progressBarSubject = new BehaviorSubject(0);
    responseList = [];
    //progressBar = this.progressBarSource.asObservable();
    result1: any = ""
    constructor(private _http: HttpClient) {

    }
    // uploadActivity(filelist: File[]) {
    //     console.log(filelist.length);
    //     this.responseList = []
    //     let widthPerFile = 100 / filelist.length;
    //     filelist.forEach((file, index) => {
    //         console.log(index)
    //         this.upload(file).then(data => {
    //             this.responseList.push(data);
    //             console.log(data);
    //             let value = this.progressBarSubject.getValue();
    //             this.progressBarSubject.next(Math.min(value + widthPerFile, 100))
    //             if (index == filelist.length - 1) {
    //                 console.log(index, this.responseList.length)
    //                 this.save().subscribe(data => {
    //                     return data;
    //                 });
    //             }
    //         }).catch(err => {
    //             console.log("got error")
    //         })
    //     })

    // }
    async uploadActivity(filelist: File[]) {
        this.responseList = []
        let widthPerFile = 100 / filelist.length;
        let batchId;
        this.progressBarSubject.next(0);
        this._http.get("http://localhost:3000/v1/callMaster/getLatestBatch").subscribe(async data => {
            batchId = data['batchId'];
            for (const [index, file] of filelist.entries()) {
                let response = await this.upload(file, batchId);
                console.log(response, Date.now());
                this.responseList.push(response);
                let value = this.progressBarSubject.getValue();
                if (index == filelist.length - 1) {
                    this.progressBarSubject.next(100);
                }else{
                    this.progressBarSubject.next(Math.round(Math.min(value + widthPerFile, 100)))
                }
                
            }
        })


    }

    save() {
        console.log(this.responseList);
        return this._http.post("http://localhost:3000/v1/callMaster/", this.responseList);
    }
    upload(file, batchId) {
        console.log(Date.now())
        let formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('loadedBy', 'admin')
        formData.append('batchId', batchId)
        return this._http.post("http://localhost:5000/upload", formData).toPromise();
    }


}