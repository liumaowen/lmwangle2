import { ModalDirective } from 'ngx-bootstrap/modal';
import { element } from 'protractor';
import { GmbiService } from './../../gmbi.service';
import { SettingsService } from './../../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-useroverview',
  templateUrl: './useroverview.component.html',
  styleUrls: ['./useroverview.component.scss']
})
export class UseroverviewComponent implements OnInit {

  showloading:boolean = true;

  gridOptions:GridOptions ;

  echartsdata = {
    "date":[],
    "iinc":[],
    "oinc":[],
    "ioinc":[],
    "isum":[],
    "osum":[],
    "iosum":[],
    "iact":[],
    "oact":[],
    "ioact":[],
    "istp":[],
    "ostp":[],
    "iostp":[]
  }

  constructor(public settings:SettingsService,private gmbiservice:GmbiService) { 

    //grid表格
    this.gridOptions = {
                  suppressAggFuncInHeader: true,
                  enableRangeSelection: true,
                  rowDeselection: true,
                  overlayLoadingTemplate: this.settings.overlayLoadingTemplate, 
                  overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,         
                  suppressRowClickSelection: true,   
                  enableColResize: true,
                  enableSorting: true,
                  excelStyles:this.settings.excelStyles,
                  getContextMenuItems: this.settings.getContextMenuItems,
		  };

      this.getgrid();

      this.gridOptions.columnDefs  = [ 
                          {headerName: '日期', field: 'date', width: 120},

                          {cellClass:'text-center', headerName: '用户总量',headerClass:'wis-ag-center',
                           children: [
                              {cellClass:'text-center text-red',headerClass:'text-red', headerName: '总量', field: 'iosum', width: 90,cellRenderer:  (params)=> params.data.isum+params.data.osum},
                              {cellClass:'text-center', headerName: '外部总量', field: 'osum', width: 90},
                              {cellClass:'text-center', headerName: '内部总量', field: 'isum', width: 90}
                            ]
                          },

                          {cellClass:'text-center', headerName: '活跃用户',headerClass:'wis-ag-center',
                           children: [
                              {cellClass:'text-center text-red',headerClass:'text-red', headerName: '总量', field: 'ioact', width: 60,cellRenderer: (params)=> '<a target="_blank" href="#/useranalysis/useractive?date='+params.data.date+'">'+(params.data.iact+params.data.oact)+'</a>'},
                              {cellClass:'text-center', headerName: '外部活跃用户', field: 'oact', width: 120,cellRenderer:  (params)=> '<a target="_blank" href="#/useranalysis/useractive?wiskind=0&date='+params.data.date+'">'+parseInt(params.value)+'</a>'},
                              {cellClass:'text-center', headerName: '内部活跃用户', field: 'iact', width: 120,cellRenderer:  (params)=> '<a target="_blank" href="#/useranalysis/useractive?wiskind=1&date='+params.data.date+'">'+parseInt(params.value)+'</a>'}
                            ]
                          },

                          {cellStyle: { "text-align": "center" }, headerName: '新增用户',headerClass:'wis-ag-center',
                           children: [
                              {cellClass:'text-center text-red',headerClass:'text-red', headerName: '总量', field: 'ioinc', width: 90, cellRenderer: (params)=> (params.data.iinc+params.data.oinc)},
                              {cellClass:'text-center', headerName: '外部新增', field: 'oinc', width: 90},
                              {cellClass:'text-center', headerName: '内部新增', field: 'iinc', width: 90}
                            ]
                          },

                          {headerName: '停用用户',headerClass:'wis-ag-center',
                           children: [
                              {cellClass:'text-center text-red',headerClass:'text-red', headerName: '总量', field: 'iostp', width: 60,cellRenderer:  (params)=> (params.data.istp+params.data.ostp)},
                              {cellClass:'text-center', headerName: '外部停用用户', field: 'ostp', width: 120},
                              {cellClass:'text-center', headerName: '内部停用用户', field: 'istp', width: 120}
                            ]
                          }
		              ];
  }


  // chartOption = {
  //   tooltip: {
  //     trigger: 'axis'
  //   },
  //   legend: {
  //     data: ['内部新增用户', '外部新增用户', '新增用户总量', '内部总量', '外部总量', '全部用户', '内部活跃用户' , '外部活跃用户', '全部活跃用户', '内部停用用户', '外部停用用户', '全部停用用户']
  //   },
  //   toolbox: {
  //     feature: {
  //       saveAsImage: {}
  //     }
  //   },
  //   grid: {
  //     left: '3%',
  //     right: '4%',
  //     bottom: '3%',
  //     containLabel: true
  //   },
  //   xAxis: [
  //     {
  //       type: 'category',
  //       boundaryGap: false,
  //       data: []
  //     }
  //   ],
  //   yAxis: [
  //     {
  //       type: 'value'
  //     }
  //   ],
  //   series: [
  //     {
  //       name: '内部新增用户',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '外部新增用户',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '新增用户总量',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '内部总量',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '外部总量',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '全部用户',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '内部活跃用户',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '外部活跃用户',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '全部活跃用户',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '内部停用用户',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '外部停用用户',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     },
  //     {
  //       name: '全部停用用户',
  //       type: 'line',
  //       // stack: '总量',
  //       label: {
  //         normal: {
  //           show: true,
  //           position: 'top'
  //         }
  //       },
  //       data: []
  //     }
  //   ]
  // }

  ngOnInit() {
  }

  getgrid(){
      this.gmbiservice.getcountbyday(this.search).then(data=>{
        if(!data.length){
          this.gridOptions.api.setRowData(data);
          return;
        };
          this.gridOptions.api.setRowData(data);
          let le = Math.min(data.length,7)-1;
          // for (var i = le; i >= 0; i--) {
          //   var element = data[i];
          //   this.echartsdata.date.push(element.date);
          //   this.echartsdata.iact.push(element["iact"]);
          //   this.echartsdata.oact.push(element["oact"]);
          //   this.echartsdata.ioact.push(element["oact"] + element["iact"]);
          //   this.echartsdata.iinc.push(element["iinc"]);
          //   this.echartsdata.oinc.push(element["oinc"]);
          //   this.echartsdata.ioinc.push(element["iinc"] + element["oinc"]);
          //   this.echartsdata.istp.push(element["istp"]);
          //   this.echartsdata.ostp.push(element["ostp"]);
          //   this.echartsdata.iostp.push(element["ostp"] + element["istp"]);
          //   this.echartsdata.isum.push(element["isum"]);
          //   this.echartsdata.osum.push(element["osum"]);
          //   this.echartsdata.iosum.push(element["osum"] + element["isum"]);
          // }
          // if(this.echartsdata.date){
          //     this.chartOption = Object.assign({}, this.chartOption);
          //     this.chartOption.xAxis[0].data = this.echartsdata.date;
          //     this.chartOption.series[0].data = this.echartsdata.iinc;
          //     this.chartOption.series[1].data = this.echartsdata.oinc;
          //     this.chartOption.series[2].data = this.echartsdata.ioinc;
          //     this.chartOption.series[3].data = this.echartsdata.isum;
          //     this.chartOption.series[4].data = this.echartsdata.osum;
          //     this.chartOption.series[5].data = this.echartsdata.iosum;
          //     this.chartOption.series[6].data = this.echartsdata.iact;
          //     this.chartOption.series[7].data = this.echartsdata.oact;
          //     this.chartOption.series[8].data = this.echartsdata.ioact;
          //     this.chartOption.series[9].data = this.echartsdata.istp;
          //     this.chartOption.series[10].data = this.echartsdata.ostp;
          //     this.chartOption.series[11].data = this.echartsdata.iostp;
          //     this.showloading = false;
          // }
      })
  }
  

  //弹窗
  @ViewChild('classicModal') private classModel :ModalDirective;

  //打开弹窗
  query(){
    this.classModel.show();
  }

  //开始时间
  start:Date;

  //结束时间
  end:Date;
  
  //重置查询条件
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

  //关闭弹窗
  colse(){
    this.classModel.hide();
    // this.selectNull();
  }

  querylist(){
    if(this.start)this.search["start"] = this.datezhuanhuan(this.start);
    if(this.end)this.search["end"] = this.datezhuanhuan(this.end);
    this.getgrid();
    this.colse();
  }

  //查询接口条件对象
  search: object = {
    start: '',
    end: ''
  }

  //时间转换
  datezhuanhuan(date){
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  //开始时间最大时间
  startmax:Date = new Date();

  //开始时间最小时间
  startmin:Date;

  //结束时间最小时间
  endmax:Date  = new Date();

  //结束时间最小时间
  endmin:Date;

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

  //     //开始时间最大时间
  // startmax(){
  //   let data;
  //   if(this.end){
  //     data = this.end;
  //   }else{
  //     data = new Date();
  //   }
  //   return data;
  // }

  // //开始时间最小时间
  // startmin(){
  //   let data;
  //   if(this.end){
  //     data = new Date(this.end.getTime() - (30*24*60*60*1000));
  //   }
  //   return data;
  // }

  // //结束时间最小时间
  // endmin(){
  //   let data;
  //   if(this.start){
  //     data = this.start;
  //   }
  //   return data;
  // }

  // //结束时间最大时间
  // endmax(){
  //   let data;
  //   if(this.start){
  //     data = new Date(this.start.getTime() + (30*24*60*60*1000));
  //     if(data > new Date()){
  //       data = new Date();
  //     }
  //   }else{
  //     data = new Date();
  //   }
  //   return data;
  // }


}
