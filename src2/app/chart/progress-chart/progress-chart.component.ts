import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js'
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';


@Component({
    selector: 'progress-chart',
    templateUrl: './progress-chart.component.html'
})

export class ProgressChart implements OnInit, AfterViewInit {

    progressdata: Object = {
        datasets: [{
            data: [],
            backgroundColor: []//['rgba(54, 162, 235, 1)', '#4CAF50', 'rgba(255,99,132, 1)', 'rgba(255, 205,86, 1)']
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: []
    };
    @Output('worklist') worklistEvent = new EventEmitter();
    constructor(private _api: AppService, private router: Router) {
        this._api.getData('http://localhost:3000/v1/stats/today').subscribe(data => {
            let tempArr: any = [];
            let totalCount = 0;
            tempArr.forEach(item => {
                totalCount += item['count']
            })
            tempArr = data;
            tempArr.forEach(item => {
                this.progressdata['datasets'][0]['data'].push(item['count'])
                this.progressdata['labels'].push(item['_id'])
                if (item._id == "AutoAnalyzed") {
                    this.progressdata['datasets'][0]['backgroundColor'].push('#4CAF50')
                }
                else if (item._id == "uploaded") {
                    this.progressdata['datasets'][0]['backgroundColor'].push('rgba(54, 162, 235, 1)')
                }
                else if (item._id == "PendingAnalysis") {
                    this.progressdata['datasets'][0]['backgroundColor'].push('rgba(255,99,132, 1)')
                } else {
                    this.progressdata['datasets'][0]['backgroundColor'].push('rgba(255, 205,86, 1')
                }

            })
            this.displayChart();
            //console.log(this.progressdata['datasets'][0]['data'])
        })
    }
    index = 0;
    openWorkList(event) {
        //console.log(c);
        //console.log(this.index)
        this.worklistEvent.emit('PROGRESS');
    }
    @ViewChild('progressChart', { static: true }) private progressChartRef;
    chart: any;
    ngAfterViewInit() {
        //    this.ngOnInit();
    }
    ngOnInit() {

    };
    handleClick() {
        let todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        let todayDateInMS = Date.parse(todayDate + "");
        let filter = { "from_date": todayDateInMS };
        this._api.setFilterData(filter);
        this.router.navigateByUrl("/worklist")
    }
    displayChart() {
        this.chart = new Chart(this.progressChartRef.nativeElement, {
            type: 'pie',
            data: this.progressdata,
            options: this.presoptions
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

    presoptions: Object = {
        response: false,
        // onClick: function (c,i){
        //     this.index = i[0]._index;
        //     //this.openWorkList()
        // },
        title: {
            display: true,
            position: 'right'
        },
        rotation: -0.7 * Math.PI,
        legend: {
            display: true,
            position: 'right',
            labels: {
                generateLabels: function (chart) {
                    var data = chart.data;
                    if (data.labels.length && data.datasets.length) {
                        return data.labels.map(function (label, i) {
                            var meta = chart.getDatasetMeta(0);
                            var ds = data.datasets[0];
                            var arc = meta.data[i];
                            var custom = arc && arc.custom || {};
                            var getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
                            var arcOpts = chart.options.elements.arc;
                            var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                            var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                            var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                            return {
                                // And finally : 
                                text: label,
                                fillStyle: fill,
                                strokeStyle: stroke,
                                lineWidth: bw,
                                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                index: i
                            };
                        });
                    }
                    return [];
                }
            }
        }

    }

} 