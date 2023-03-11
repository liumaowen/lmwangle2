import { DatePipe, DecimalPipe } from '@angular/common';
import { GmbiService } from './../../gmbi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';
import { SettingsService } from './../../../../core/settings/settings.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-ordermonth',
    templateUrl: './ordermonth.component.html',
    styleUrls: ['./ordermonth.component.scss'],
    providers: [DatePipe, DecimalPipe]
})
export class OrdermonthComponent implements OnInit {

    search = {
        startdate: new Date(),
        enddate: new Date()
    }

    selectfors($event) {
        this.search['startdate'] = $event;
        this.dateEMin = $event;
        if (moment($event).add(11, 'M').toDate() > new Date()) {
            this.dateEMax = new Date();
        } else {
            this.dateEMax = moment($event).add(11, 'M').toDate();
        }
    }

    selectfore($event) {
        this.search['enddate'] = $event;
        this.dateSMax = $event;
        this.dateSMin = moment($event).subtract(11, 'M').toDate();
    }


    dateSMin = moment(new Date()).subtract(11, 'M').toDate();
    dateSMax = new Date();
    dateEMin = this.search['startdate'];
    dateEMax = new Date();

    //aggird表格原型
    gridOptions: GridOptions;

    constructor(public settings: SettingsService, private gmbiApi: GmbiService, private datepipe: DatePipe, private numpipe: DecimalPipe) {

        //aggird实例对象
        this.gridOptions = {
            groupDefaultExpanded: -1,
            suppressAggFuncInHeader: true,
            enableRangeSelection: true,
            rowDeselection: true,
            overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
            overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
            enableColResize: true,
            enableSorting: true,
            excelStyles: this.settings.excelStyles,
            //菜单
            getContextMenuItems: this.settings.getContextMenuItems
        };

        this.gridOptions.onGridReady = () => this.gridOptions.api.sizeColumnsToFit();
        //自定义组 头部/尾部内容。
        // this.gridOptions.groupUseEntireRow = true;
        //防止多生成一个组列出现
        this.gridOptions.groupSuppressAutoColumn = true;

        //设置aggird表格列
        this.gridOptions.columnDefs = [
            { headerName: '月份', field: 'nianyue', minWidth: 90, cellRenderer: 'group', showRowGroup: 'nianyue', rowGroup: true },
            { cellClass: 'text-center', headerName: '品名', field: 'gn', minWidth: 60 },
            { cellClass: 'text-center', headerName: '产地', field: 'chandi', minWidth: 70 },
            { cellClass: 'text-center', headerName: '地区', field: 'areaname', minWidth: 70 },

            {
                cellStyle: { "display": "block" }, headerName: '合计', headerClass: 'wis-ag-center',
                children: [
                    { cellStyle: { "text-align": "right" }, headerName: '开单', field: 'hjall', minWidth: 70, aggFunc: 'sum', valueGetter: (params) => params.data['olall'] + params.data['oflagentall'] + params.data['oflselfall'], valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'hjpaid', minWidth: 80, aggFunc: 'sum', valueGetter: (params) => params.data['olpaid'] + params.data['oflagentpaid'] + params.data['oflselfpaid'], valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'hjcancel', minWidth: 95, aggFunc: 'sum', valueGetter: (params) => params.data['olcancel'] + params.data['oflagentcancel'] + params.data['oflselfcancel'], valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '实提', field: 'hjshiti', minWidth: 70, aggFunc: 'sum', valueGetter: (params) => params.data['olshiti'] + params.data['oflagentshiti'] + params.data['oflselfshiti'], valueFormatter: this.settings.valueFormatter3 }
                ]
            },

            {
                cellStyle: { "display": "block" }, headerName: '加工合计', headerClass: 'wis-ag-center',
                children: [
                    { cellStyle: { "text-align": "right" }, headerName: '开单', field: 'jgall', minWidth: 70, aggFunc: 'sum', valueGetter: (params) => params.data['oflagentprodall'] + params.data['oflselfprodall'], valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'jgpaid', minWidth: 80, aggFunc: 'sum', valueGetter: (params) => params.data['oflagentprodpaid'] + params.data['oflselfprodpaid'], valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'jgcancel', minWidth: 95, aggFunc: 'sum', valueGetter: (params) => params.data['oflagentprodcancel'] + params.data['oflselfprodcancel'], valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '实提', field: 'jgshiti', minWidth: 70, aggFunc: 'sum', valueGetter: (params) => params.data['oflagentprodshiti'] + params.data['oflselfprodshiti'], valueFormatter: this.settings.valueFormatter3 }
                ]
            },

            {
                cellClass: 'text-center', headerName: '线上', headerClass: 'wis-ag-center',
                children: [
                    { cellClass: 'text-right', headerName: '开单', field: 'olall', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellClass: 'text-right', headerName: '已付款', field: 'olpaid', minWidth: 80, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellClass: 'text-right', headerName: '取消/撤销', field: 'olcancel', minWidth: 95, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '实提', field: 'olshiti', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 }
                ]
            },

            {
                cellClass: 'text-center', headerName: '代销', headerClass: 'wis-ag-center',
                children: [
                    { cellClass: 'text-right', headerName: '开单', field: 'oflagentall', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellClass: 'text-right', headerName: '已付款', field: 'oflagentpaid', minWidth: 80, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellClass: 'text-right', headerName: '取消/撤销', field: 'oflagentcancel', minWidth: 95, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '实提', field: 'oflagentshiti', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 }
                ]
            },

            {
                cellStyle: { "text-align": "center" }, headerName: '代销加工', headerClass: 'wis-ag-center',
                children: [
                    { cellStyle: { "text-align": "right" }, headerName: '开单', field: 'oflagentprodall', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'oflagentprodpaid', minWidth: 80, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'oflagentprodcancel', minWidth: 95, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '实提', field: 'oflagentprodshiti', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 }
                ]
            },

            {
                cellClass: 'text-center', headerName: '自销', headerClass: 'wis-ag-center',
                children: [
                    { cellClass: 'text-right', headerName: '开单', field: 'oflselfall', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellClass: 'text-right', headerName: '已付款', field: 'oflselfpaid', minWidth: 80, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellClass: 'text-right', headerName: '取消/撤销', field: 'oflselfcancel', minWidth: 95, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '实提', field: 'oflselfshiti', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 }
                ]
            },

            {
                cellClass: 'text-center', headerName: '自销加工', headerClass: 'wis-ag-center',
                children: [
                    { cellClass: 'text-right', headerName: '开单', field: 'oflselfprodall', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellClass: 'text-right', headerName: '已付款', field: 'oflselfprodpaid', minWidth: 80, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellClass: 'text-right', headerName: '取消/撤销', field: 'oflselfprodcancel', minWidth: 95, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '实提', field: 'oflselfprodshiti', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 }
                ]
            },

            {
                cellStyle: { "text-align": "center" }, headerName: '内销', headerClass: 'wis-ag-center',
                children: [
                    { cellStyle: { "text-align": "right" }, headerName: '买入', field: 'insidebuy', minWidth: 70, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 },
                    { cellStyle: { "text-align": "right" }, headerName: '卖出', field: 'insidesale', minWidth: 80, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 }
                ]
            },

            { cellClass: 'text-right', headerName: '退货', field: 'tuihuo', minWidth: 60, aggFunc: 'sum', valueFormatter: this.settings.valueFormatter3 }

        ];

    }

    ngOnInit() {
        //页面加载请求当月的数据
        this.querylist();
    }

    //清除填写内容
    selectNull() {
        this.search = {
            startdate: new Date(),
            enddate: new Date()
        }
    }


    //获取查询弹窗
    @ViewChild('classicModal') private classModel: ModalDirective;

    //查询接口
    query() {
        this.classModel.show();
    }

    //关闭查询弹窗
    coles() {
        this.classModel.hide();
    }

    select() {
        this.gridOptions.groupDefaultExpanded = 0;
        this.querylist();
        this.coles();
    }

    //查询每月销售订单
    querylist() {
        let se = { start: '', end: '' }
        if (this.search.startdate && this.search.enddate) {
            se.start = this.datepipe.transform(this.search.startdate, 'y-MM');
            se.end = this.datepipe.transform(this.search.enddate, 'y-MM');
        }
        this.gmbiApi.getOfmonth(se).then(data => {
            this.gridOptions.api.setRowData(data);
        })
    }

    selects(e) {
        this.search.startdate = e;
    }
    selecte(e) {
        this.search.enddate = e;
    }

    // aggird保留整数
    valueFormatter = (params) => {
        try {
            return this.numpipe.transform(params.value, '1.0-0')
        } catch (error) {
            return null
        }
    }

}
