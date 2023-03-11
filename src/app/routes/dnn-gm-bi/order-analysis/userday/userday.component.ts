import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe, DecimalPipe } from '@angular/common';
import { UserapiService } from './../../../../dnn/service/userapi.service';
import { GmbiService } from './../../gmbi.service';
import { SettingsService } from './../../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-userday',
  templateUrl: './userday.component.html',
  styleUrls: ['./userday.component.scss']
})
export class UserdayComponent implements OnInit {

  search: object = {
    start: '',
    end: ''
  }

  //开始时间最大时间
  startmax:Date = new Date();

  //开始时间最小时间
  startmin:Date = new Date(new Date().getTime() - 6*24*3600000);

  //结束时间最小时间
  endmax:Date  = new Date();

  //结束时间最小时间
  endmin:Date = new Date();

  //选择开始时间
  selectstart(){
    this.endmin = this.start;
    this.endmax = new Date(this.start.getTime() + 6 * 24 * 3600000);
    if(this.endmax > new Date()){
      this.endmax = new Date();
    }
  }

  //选择结束使劲
  selectend(){
    this.startmax = this.end;
    this.startmin = new Date(this.end.getTime() - 6 * 24 * 3600000);
  }

    //开始时间
  start:Date = new Date();

  //结束时间
  end:Date = new Date();
  

  //aggird表格原型
  gridOptions:GridOptions;

  constructor( public settings:SettingsService,private gmbiApi:GmbiService,private datepipe:DatePipe,private numpipe:DecimalPipe,private toasterService:ToasterService) { 
        
    //aggird实例对象
    this.gridOptions = {
        groupDefaultExpanded:1,
        suppressAggFuncInHeader: true,
        enableRangeSelection: true,
        rowDeselection: true,
        overlayLoadingTemplate: this.settings.overlayLoadingTemplate, 
        overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,         
        enableColResize: true,
        enableSorting: true,
        excelStyles:this.settings.excelStyles,
        getContextMenuItems: this.settings.getContextMenuItems,
        //开始编辑时判断时间
        onCellEditingStarted:(params)=>{
          if(params.data.riqi != this.datepipe.transform(new Date(),"y-MM-dd")) this.gridOptions.api.stopEditing();
        }
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    //设置aggird表格列
    this.gridOptions.columnDefs  = [ 
                        //   {field: "nianyue", rowGroupIndex: 0, hide: true},
                          {cellStyle: {"text-align": "left"}, headerName: '日期', field: 'riqi', minWidth: 110,rowGroupIndex:1,cellRenderer: 'group',showRowGroup:'riqi'},
                          {headerName: '业务员', field: 'saleman', minWidth: 90,cellRenderer: 'group',showRowGroup:'saleman',rowGroup:true},
                          {cellStyle: {"text-align": "center"}, headerName: '品名', field: 'gn', minWidth: 60},
                          {cellStyle: {"text-align": "center"}, headerName: '产地', field: 'chandi', minWidth: 70},
                          {cellStyle: {"text-align": "center"}, headerName: '地区', field: 'areaname', minWidth: 70},

                          {cellStyle: {"display":"block" }, headerName: '合计',headerClass:'wis-ag-center',
                            children: [
                              {cellStyle: { "text-align": "right"}, headerName: '开单', field: 'hjall', minWidth: 70,aggFunc: 'sum',valueGetter: (params)=> params.data['olall'] +params.data['oflagentall']+params.data['oflselfall'],valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'hjpaid', minWidth: 80,aggFunc: 'sum',valueGetter: (params)=> params.data['olpaid'] +params.data['oflagentpaid']+params.data['oflselfpaid'],valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'hjcancel', minWidth: 95,aggFunc: 'sum',valueGetter: (params)=> params.data['olcancel'] +params.data['oflagentcancel']+params.data['oflselfcancel'],valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '实提', field: 'hjshiti', minWidth: 70,aggFunc: 'sum',valueGetter: (params)=> params.data['olshiti'] +params.data['oflagentshiti']+params.data['oflselfshiti'],valueFormatter: this.settings.valueFormatter3}
                          ]},

                          {cellStyle: {"display":"block" }, headerName: '加工合计',headerClass:'wis-ag-center',
                            children: [
                              {cellStyle: { "text-align": "right"}, headerName: '开单', field: 'jgall', minWidth: 70,aggFunc: 'sum',valueGetter: (params)=> params.data['oflagentprodall'] +params.data['oflselfprodall'],valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'jgpaid', minWidth: 80,aggFunc: 'sum',valueGetter: (params)=> params.data['oflagentprodpaid'] +params.data['oflselfprodpaid'],valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'jgcancel', minWidth: 95,aggFunc: 'sum',valueGetter: (params)=> params.data['oflagentprodcancel'] +params.data['oflselfprodcancel'],valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '实提', field: 'jgshiti', minWidth: 70,aggFunc: 'sum',valueGetter: (params)=> params.data['oflagentprodshiti'] +params.data['oflselfprodshiti'],valueFormatter: this.settings.valueFormatter3}
                          ]},

                          {cellStyle: {"display":"block" }, headerName: '线上',headerClass:'wis-ag-center',
                            children: [
                              {cellStyle: { "text-align": "right"}, headerName: '开单', field: 'olall', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'olpaid', minWidth: 80,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'olcancel', minWidth: 95,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '实提', field: 'olshiti', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3}
                          ]},

                          {cellStyle: { "text-align": "center" }, headerName: '代销',headerClass:'wis-ag-center',
                            children: [
                              {cellStyle: { "text-align": "right" }, headerName: '开单', field: 'oflagentall', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'oflagentpaid', minWidth: 80,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'oflagentcancel', minWidth: 95,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '实提', field: 'oflagentshiti', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3}
                          ]},

                          {cellStyle: { "text-align": "center" }, headerName: '代销加工',headerClass:'wis-ag-center',
                            children: [
                              {cellStyle: { "text-align": "right" }, headerName: '开单', field: 'oflagentprodall', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'oflagentprodpaid', minWidth: 80,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'oflagentprodcancel', minWidth: 95,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '实提', field: 'oflagentprodshiti', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3}
                          ]},

                          {cellStyle: { "text-align": "center" }, headerName: '自销',headerClass:'wis-ag-center',
                            children: [
                              {cellStyle: { "text-align": "right" }, headerName: '开单', field: 'oflselfall', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'oflselfpaid', minWidth: 80,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'oflselfcancel', minWidth: 95,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '实提', field: 'oflselfshiti', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3}
                          ]},

                          {cellStyle: { "text-align": "center" }, headerName: '自销加工',headerClass:'wis-ag-center',
                            children: [
                              {cellStyle: { "text-align": "right" }, headerName: '开单', field: 'oflselfprodall', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '已付款', field: 'oflselfprodpaid', minWidth: 80,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '取消/撤销', field: 'oflselfprodcancel', minWidth: 95,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},
                              {cellStyle: { "text-align": "right" }, headerName: '实提', field: 'oflselfprodshiti', minWidth: 70,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3}
                          ]},

                          {cellStyle: {"text-align": "right"}, headerName: '内采', field: 'inside', minWidth: 60,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3},

                          {cellStyle: {"text-align": "right"}, headerName: '退货', field: 'tuihuo', minWidth: 60,aggFunc: 'sum',valueFormatter: this.settings.valueFormatter3}

		              ];
  }

  ngOnInit() { 
    //页面加载请求当月的数据
    this.querylist();
  }

  //清除填写内容
  selectNull(){
    this.search = {
      start: '',
      end: ''
    };
    this.start = null;
    this.end = null;
    this.startmax = new Date();
    this.endmax = new Date();
    this.startmin = null;
    this.endmin = null;
  }


  //获取查询弹窗
  @ViewChild('classicModal') private classModel :ModalDirective;
  
  //查询接口
  query(){
    this.classModel.show();
  }

  //关闭查询弹窗
  coles(){
      this.classModel.hide();
  }

  select(){
      this.gridOptions.groupDefaultExpanded = 0;
      this.querylist();
      this.coles();
  }

  //查询每月销售订单
  querylist(){
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    this.gmbiApi.getOfuserday(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    })
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
