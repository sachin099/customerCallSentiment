import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, Input, ElementRef, AfterContentInit } from '@angular/core';
import { Chart } from 'chart.js'
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';


@Component({
    selector: 'doughnut-chart',
    templateUrl: './doughnut-chart.component.html'
})

export class DoughtnutChart implements OnInit, AfterViewInit, AfterContentInit {

    doughnutData: Object = {
        datasets: [{
            data: [],
            backgroundColor: []
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [],

    };
    @Input('data') inputData;
    constructor(private _api: AppService, private router: Router) {
        if (this.inputData) {
            let tempArr: any = [];
            let totalCount = 0;
            tempArr.forEach(item => {
                totalCount += item['count']
            })
            tempArr = this.inputData['info'];
            tempArr.forEach(item => {
                this.doughnutData['datasets'][0]['data'].push(item['count'])
                this.doughnutData['labels'].push(item['name'])
                if (item.name == "AutoAnalyzed") {
                    this.doughnutData['datasets'][0]['backgroundColor'].push('#4CAF50')
                }
                else if (item.name == "uploaded") {
                    this.doughnutData['datasets'][0]['backgroundColor'].push('rgba(54, 162, 235, 1)')
                }
                else if (item.name == "PendingAnalysis") {
                    this.doughnutData['datasets'][0]['backgroundColor'].push('rgba(255,99,132, 1)')
                } else {
                    this.doughnutData['datasets'][0]['backgroundColor'].push('rgba(255, 205,86, 1')
                }
            })
            this.displayChart();
        }
    }
    index = 0;
    openWorkList(event) {
    }
    @ViewChild('doughnutChart', { static: true }) private doughnutChartRef;
    chart: any;
    ngAfterViewInit() {
        this.displayChart();
    }
    ngAfterContentInit() {
        this.displayChart();
    }
    ngOnInit() {
        let tempArr: any = [];
        let totalCount = 0;
        tempArr.forEach(item => {
            totalCount += item['count']
        })
        tempArr = this.inputData['info'];
        tempArr.forEach(item => {
            this.doughnutData['datasets'][0]['data'].push(item['count'])
            this.doughnutData['labels'].push(item['name'])
            if (item.name == "AutoAnalyzed") {
                this.doughnutData['datasets'][0]['backgroundColor'].push('#4CAF50')
            }
            else if (item.name == "uploaded") {
                this.doughnutData['datasets'][0]['backgroundColor'].push('rgba(54, 162, 235, 1)')
            }
            else if (item.name == "PendingAnalysis") {
                this.doughnutData['datasets'][0]['backgroundColor'].push('rgba(255,99,132, 1)')
            } else {
                this.doughnutData['datasets'][0]['backgroundColor'].push('rgba(255, 205,86, 1')
            }
        })
        //console.log(this.doughnutData)
        this.displayChart();

    };
    displayChart() {

        //let context = (<HTMLCanvasElement>this.doughnutChartRef.nativeElement).getContext('2d');
        this.chart = new Chart(this.doughnutChartRef.nativeElement, {
            type: 'doughnut',
            data: this.doughnutData,
            options: this.doughnutOptions
        })
        Chart.defaults.global.defaultFontColor = 'black';
        Chart.defaults.global.defaultFontSize = 16;
        Chart.plugins.register({
            afterDatasetsDraw: function (chartInstance, easing) {
                // To only draw at the end of animation, check for easing === 1
                var ctx = chartInstance.chart.ctx;
                chartInstance.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index) {
                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'black';
                            var fontSize = 16;
                            var fontStyle = 'normal';
                            var fontFamily = 'Helvetica Neue';
                            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
                            // Just naively convert to string for now
                            var dataString = dataset.data[index].toString();
                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            var padding = 3;
                            var position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                        });
                    }
                });
            }
        });
    }

    doughnutOptions: Object = {
        responsive: true,
        legend: {
            position: 'right',
            labels: {
                padding: 20,
                boxWidth: 10
            }
        },
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += data;
                    });
                    let percentage = (value * 100 / sum).toFixed(2);
                    return percentage;
                },
                color: 'white',
                labels: {
                    title: {
                        font: {
                            size: '16'
                        }
                    }
                }
            }
        }

    }

    handleClick() {
        let filter = {'batchId': this.inputData['batchId']};
        this._api.setFilterData(filter);
        this.router.navigateByUrl("/worklist")
    }

} 