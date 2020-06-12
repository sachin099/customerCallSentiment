import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppService {

    constructor(private _http: HttpClient) {

    }
    key: string = null;
    setKey(key) {
        this.key = key;
    }
    isUserLoggedIn() {
        return this.key !== null;
    }
    getUrl() {
        let str = 'http://127.0.0.1:3000'
        return str;
    }
    getData(url) {
        return this._http.get(url);
    }
    postData(url, data) {
        console.log(url)
        return this._http.post(url, data);
    }
    postFile(url, file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('fileKey', file, file.name);
        return this._http.post(url, formData)

    }
    samplePost(url, list: File[]) {
        return this._http.post(url, list);
    }

    getStaticData() {
        this._http.get('assets/staticData.json');
    }

    filter: Object = {};
    getFilterData() {
        return this.filter;
    }
    setFilterData(filter) {
        this.filter = filter;
    }
}