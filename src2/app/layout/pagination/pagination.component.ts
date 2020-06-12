import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'

@Component({
    'selector': 'pagination',
    'templateUrl': './pagination.component.html',
    'styleUrls': ['./pagination.component.css']
})

export class PaginationComponent implements OnInit {
    pageList: any = [1, 2, 3];

    @Input('totalPage') totalPage = 20;
    @Input('currentPage') currentPage = 1;
    @Output('gotoPage') pageClicked = new EventEmitter();
    constructor() {

    }
    ngOnInit() {
        //thi
    }
    goToPage(event) {
        this.pageClicked.emit(event);
    }
}