import { ActivatedRoute } from '@angular/router';
import { UserapiService } from './../../../../dnn/service/userapi.service';
import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { GmbiService } from './../../gmbi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../../core/settings/settings.service';

@Component({
  selector: 'app-useractive',
  templateUrl: './useractive.component.html',
  styleUrls: ['./useractive.component.scss']
})
export class UseractiveComponent implements OnInit {

  showloading:boolean = true;
  showiuser:boolean = true;
  showouser:boolean = true;

  gridOptions:GridOptions ;

  start:Date;

  end: Date

  maxdate:Date = new Date();

  //内部用户前十数组
  idata = {"name":[],"value": []};

  alldata = [];
  iudata = [];

  oudata = [];

  //外部前十数据
  odata = {"name":[],"value": []};

  echartsIntance;

  active;

  constructor(public settings: SettingsService,private gmbiservice:GmbiService,private userApi:UserapiService,private activatedRoute:ActivatedRoute) { 

    //select默认选中值
    this.active = [this.items[0]];

    //表格
    this.gridOptions = {
        suppressAggFuncInHeader: true,
        enableRangeSelection: true,
        rowDeselection: true,
        overlayLoadingTemplate: this.settings.overlayLoadingTemplate, 
        overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,         
        enableColResize: true,
        enableSorting: true,
        excelStyles:this.settings.excelStyles,
        getContextMenuItems: this.settings.getContextMenuItems,
    };
    let searchs = {
      urname: '',
      company: '',
      countmin: '',
      countmax: '',
      wiskind: '',
      start: '',
      end: ''
    };

    //获取页面传递过来的参数
    this.activatedRoute.queryParams.subscribe(params => {
        if(params['date']){ 
          searchs["start"] = params['date'];
          searchs["end"] = params['date'];
        }
        if(params['wiskind'] == 0 || params['wiskind'] == 1) searchs["wiskind"] = params['wiskind'];
    });

    this.getgrid(searchs);

    this.gridOptions.columnDefs = [ 
        {cellStyle: {"text-align": "center"}, headerName: '时间', field: 'date', width: 120},
        {cellStyle: {"text-align": "center"}, headerName: '用户姓名', field: 'urname', width: 120},
        {cellStyle: {"text-align": "center"}, headerName: '公司名称', field: 'company', width: 200},
        {cellStyle: {"text-align": "center"}, headerName: '访问量', field: 'count', width: 100},
        {cellStyle: {"text-align": "center"}, headerName: '是否内部用户', field: 'wiskind', width: 150},
    ];
  }
//扇形图
//   storOption = {
//     tooltip: {
//       trigger: 'item',
//       formatter: "{a} <br/>{b}: {c} ({d}%)"
//     },
//     legend: {
//       orient: 'vertical',
//       x: 'left',
//       data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
//     },
//     series: [
//       {
//         name: '访问来源',
//         type: 'pie',
//         selectedMode: 'single',
//         radius: [0, '30%'],

//         label: {
//           normal: {
//             position: 'inner'
//           }
//         },
//         labelLine: {
//           normal: {
//             show: false
//           }
//         },
//         data: [
//           { value: 335, name: '直达', selected: true },
//           { value: 679, name: '营销广告' },
//           { value: 1548, name: '搜索引擎' }
//         ]
//       },
//       {
//         name: '访问来源',
//         type: 'pie',
//         radius: ['40%', '55%'],

//         data: [
//           { value: 335, name: '直达' },
//           { value: 310, name: '邮件营销' },
//           { value: 234, name: '联盟广告' },
//           { value: 135, name: '视频广告' },
//           { value: 1048, name: '百度' },
//           { value: 251, name: '谷歌' },
//           { value: 147, name: '必应' },
//           { value: 102, name: '其他' }
//         ]
//       }
//     ]
//   };


  // iuserOption = {
  //   title: {
  //     text: '内部用户访问量'
  //   },
  //   color: ['#3398DB'],
  //   tooltip: {
  //     trigger: 'axis',
  //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
  //       type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
  //     }
  //   },
  //   toolbox: {
  //     show: true,
  //     feature: {
  //       //是否显示图片
  //       saveAsImage: {
  //         show: true
  //       }
  //     }
  //   },
  //   grid: {
  //     left: '3%',
  //     right: '4%',
  //     bottom: '3%',
  //     containLabel: true
  //   },
  //   xAxis: [{
  //     type: 'category',
  //     data: this.idata.name,
  //     axisTick: {
  //       alignWithLabel: true
  //     },
  //     axisLabel: {
  //       interval: 0,
  //       rotate: 20
  //     },
  //   }],
  //   yAxis: [{
  //     name: "访问量",
  //     type: 'value'
  //   }],
  //   series: [{
  //     name: '访问次数',
  //     type: 'bar',
  //     barWidth: '60%',
  //     label: {
  //       normal: {
  //         show: true
  //       }
  //     },
  //     data:this.idata.value
  //   }]
  // };

  // ouserOption = {
  //   title: {
  //     text: '外部用户访问量'
  //   },
  //   color: ['#3398DB'],
  //   //气泡提示框，常用于展现更详细的数据
  //   tooltip: {
  //     trigger: 'axis',
  //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
  //       type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
  //     }
  //   },
  //   toolbox: {
  //     show: true,
  //     feature: {
  //       //是否显示图片
  //       saveAsImage: {
  //         show: true
  //       }
  //     }
  //   },
  //   grid: {
  //     left: '3%',
  //     right: '4%',
  //     bottom: '3%',
  //     containLabel: true
  //   },
  //   xAxis: [{
  //     type: 'category',
  //     data: this.odata.name,
  //   //   data: ["穆建宁","文雅","张立"],
  //     axisTick: {
  //       alignWithLabel: true
  //     },
  //     axisLabel: {
  //       interval: 0,
  //       rotate: 20
  //     },
  //   }],
  //   yAxis: [{
  //     name: "访问量",
  //     type: 'value'
  //   }],
  //   series: [{
  //     name: '访问次数',
  //     type: 'bar',
  //     barWidth: '60%',
  //     label: {
  //       normal: {
  //         show: true
  //       }
  //     },
  //     data:this.odata.value
  //   //   data:[10,8,7]     
  //   }]
  // };

  onChartInit(ec) {
    this.echartsIntance = ec;
  }

  minDate: Date;
    
  maxDate: Date;
  
  invalidDates: Array<Date>;

  es: any;
  ngOnInit() {
  }

  getgrid(search){
      this.gmbiservice.getvisittoday(search).then(data=>{
          if(!data.length) {
            this.gridOptions.api.setRowData(data);
            return;
          };
          for (let i = 0; i < data.length; i++) {
            let element = data[i];
            this.alldata.push(element.urname);
            if(element["wiskind"]) {
              element["wiskind"] = "内部用户";
              this.idata.name.push(element.urname);
              this.idata.value.push(element.count);
              this.iudata.push({"name":element.urname,"value":element.count});
            }else{
              element["wiskind"] = "外部用户";
              this.odata.name.push(element.urname);
              this.odata.value.push(element.count);
              this.oudata.push({"name":element.urname,"value":element.count})
            }
            data[i] = element;
          }
        //扇形图
        // if(this.idata.value && this.odata.value){
        //     this.storOption = Object.assign({}, this.storOption);
        //     this.storOption.legend.data = this.alldata; 
        //     this.storOption.series[0].data = this.iudata;
        //     this.storOption.series[1].data = this.oudata;
        //     this.showloading = false;
        // }
        //
        // if(this.idata.value.length){
        //     this.iuserOption = Object.assign({}, this.iuserOption);
        //     this.iuserOption.series[0].data = this.idata.value.splice(0,10);
        //     this.iuserOption.xAxis[0].data = this.idata.name.splice(0,10);
        //     this.showiuser = false;
        // }
        //
        // if(this.odata.value.length){
        //     this.ouserOption = Object.assign({}, this.ouserOption);
        //     this.ouserOption.series[0].data = this.odata.value.splice(0,10);
        //     this.ouserOption.xAxis[0].data = this.odata.name.splice(0,10);
        //     this.showouser = false;
        // }
        // this.reloadChart(this.iuserOption,this.idata,this.showiuser);
        // this.reloadChart(this.ouserOption,this.odata,this.showouser);
        this.gridOptions.api.setRowData(data);
      })
  }

  reloadChart(chart,data,loading){
      chart = Object.assign({}, chart);
      chart.series[0].data = data.count;
      chart.xAxis[0].data = data.urname;
      loading = false;
  }


  @ViewChild('classicModal') private classModel :ModalDirective;

  usearch;

  searchUser(){
    this.userApi.usersearch2("");
  }
  query(){
    this.classModel.show();
  }
  
  selectNull(){
    this.search = {
      urname: '',
      company: '',
      countmin: '',
      countmax: '',
      wiskind: '',
      start: '',
      end: ''
    };
    this.start = null;
    this.end = null;
    this.startmax = new Date();
    this.endmax = new Date();
    this.startmin = null;
    this.endmin = null;
    this.active = [this.items[0]];
  }

  colse(){
    this.classModel.hide();
    //清空弹窗的值
    // this.selectNull();
  }


  search: object = {
    urname: '',
    company: '',
    countmin: '',
    countmax: '',
    wiskind: '',
    start: '',
    end: ''
  }

  //获取用户名称

  results;

    searchu(value : any) : void {
        this.userApi.usersearch2(value.query).then(date=>{
                this.results =[];
                date.json().forEach(element => {
                    this.results.push({
                        name: element.realname,
                        code: element.id
                    })
                });
        },err=>{
            console.log(err);
        });
    }

    results2: any[];

    selected(value){
      if (value.id == 1) this.search['wiskind'] = '';
      if(value.id == 2)this.search['wiskind'] = 1;
      if(value.id == 3)this.search['wiskind'] = 0;
    }

    items:any = [{id:1,text:'全部用户'},{id:2,text:'内部用户'},{id:3,text:'外部用户'}];

    searchc(value : any) : void {
        this.userApi.searchCompany(value.query).then(date=>{
                this.results2 =[];
                date.json().forEach(element => {
                    this.results2.push({
                        name: element.company,
                        code: element.id
                    })
                });
        },err=>{
            console.log(err);

        });
    }

    querylist(){
      if(this.start){
        this.search['start'] = this.datezhuanhuan(this.start);
      }
      if(this.end){
        this.search['end'] = this.datezhuanhuan(this.end);
      }
      if(this.search['urname'] instanceof Object){
        this.search['urname'] = this.search['urname'].name;
      }
      if(this.search['company'] instanceof Object){
        this.search['company'] = this.search['company'].name;
      }
      this.getgrid(this.search);
      this.colse();
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

      //开始时间最大时间
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
  //     data = new Date(this.end.getTime() - (6*24*60*60*1000));
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
  //     data = new Date(this.start.getTime() + (6*24*60*60*1000));
  //     if(data > new Date()){
  //       data = new Date();
  //     }
  //   }else{
  //     data = new Date();
  //   }
  //   return data;
  // }

}
