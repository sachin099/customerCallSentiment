import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, OnChanges } from '@angular/core'

@Component({
    'selector': 'pagination',
    'templateUrl': './pagination.component.html',
    'styleUrls': ['./pagination.component.css']
})

export class PaginationComponent implements OnInit, OnChanges {
    pageList: any = [];

    @Input('totalPage') totalPage;
    @Input('currentPage') currentPage;
    @Output('gotoPage') pageClicked = new EventEmitter();
    constructor() {

    }
    ngOnInit() {
        
    }
    ngOnChanges() {
        console.log(this.totalPage);
        if (this.totalPage != undefined) {
            this.pageList = [];
            this.pageList.push(this.currentPage);
            console.log(this.totalPage);
            if (this.currentPage + 1 <= this.totalPage) {
                this.pageList.push(this.currentPage + 1);
            }
            if (this.currentPage + 2 <= this.totalPage) {
                this.pageList.push(this.currentPage + 2);
            }
        }
    }
    goToPage(event) {
        this.pageClicked.emit(event);
    }
}