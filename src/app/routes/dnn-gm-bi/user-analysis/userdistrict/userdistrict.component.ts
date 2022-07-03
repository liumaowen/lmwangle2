import { ActivatedRoute } from '@angular/router';
import { UserapiService } from './../../../../dnn/service/userapi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../../core/settings/settings.service';
import { GmbiService } from './../../gmbi.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-userdistrict',
  templateUrl: './userdistrict.component.html',
  styleUrls: ['./userdistrict.component.scss']
})
export class UserdistrictComponent implements OnInit {

  gridOptions:GridOptions ;

  alldata = [];

  odata = {"name":[],"value": []};

  idata = {"name":[],"value": []};
  iudata = [];

  oudata = [];

  active;

  constructor(private gmbiservice:GmbiService,public settings:SettingsService,private userApi:UserapiService,private activatedRoute:ActivatedRoute ) { 
    
    this.active = [this.items[0]];
    
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

    this.getgrid();

    this.gridOptions.columnDefs = [ 
        {cellClass:'text-center', headerName: '时间', field: 'date', width: 120},
        {cellClass:'text-center', headerName: '用户姓名', field: 'urname', width: 120},
        {cellClass:'text-center', headerName: '公司名称', field: 'company', width: 200},
        {cellClass:'text-center', headerName: '是否内部用户', field: 'wiskind', width: 150},
        {cellClass:'text-center', headerName: '代理用户姓名', field: 'aurname', width: 150},
        {cellClass:'text-center', headerName: '代理用户公司名称', field: 'acompany', width: 200},
        {cellClass:'text-center', headerName: '代理用户是否内部用户', field: 'awiskind', width: 150},
        {cellClass:'text-center', headerName: 'IP地址', field: 'ip', width: 100},
        {cellClass:'text-center', headerName: '地区', field: 'district', width: 100},
        {cellClass:'text-center', headerName: '设备生产商及型号', field: 'devfacmod', width: 100},
        {cellClass:'text-center', headerName: '首次请求时间', field: 'rdate', width: 100}
    ];
  }

  // 第一次进入页面获取数据
  getgrid(){
      if(this.start){this.search['start'] = this.datezhuanhuan(this.start);}
      if(this.end){this.search['end'] = this.datezhuanhuan(this.end);}
      if(this.search['urname'])this.search['urname'] = this.search['urname'].name;
      if(this.search['company']){this.search['company'] = this.search['company'].name;}
      if(this.search['aurname'])this.search['aurname'] = this.search['aurname'].name;
      if(this.search['acompany'])this.search['acompany'] = this.search['acompany'].name;
      this.gmbiservice.getdisdevofday(this.search).then(data=>{

        if (!data.length) {
          this.gridOptions.api.setRowData(data);
          return;
        };
        for (let i = 0; i < data.length; i++) {
          let element = data[i];
          this.alldata.push(element.urname);
          if (element["wiskind"] == true) {
            element["wiskind"] = "内部用户";
            this.idata.name.push(element.urname);
            this.idata.value.push(element.count);
            this.iudata.push({ "name": element.urname, "value": element.count });
          } else if(element["wiskind"] == false) {
            element["wiskind"] = "外部用户";
            this.odata.name.push(element.urname);
            this.odata.value.push(element.count);
            this.oudata.push({ "name": element.urname, "value": element.count })
          }
          if (element["awiskind"]  == true) {
            element["awiskind"] = "内部用户";
          } else if(element["awiskind"] == false) {
            element["awiskind"] = "外部用户";
          }
          data[i] = element;
        }
        this.gridOptions.api.setRowData(data);
      })
  }

  ngOnInit() {
  }


  //获取弹窗
  @ViewChild('classicModal') private classModel :ModalDirective;

  //查询接口条件
  search:object ={
    urname: '',
    company: '',
    wiskind: '',
    start: '',
    end: '',
    district:'',
    devfacmod:'',
    aurname:'',
    acompany:'',
    awiskind:''
  }

  //关闭弹窗
  colse(){
    this.classModel.hide();
    // this.selectNull();
  }

  // 查询弹窗
  query(){
    this.classModel.show();
  }

  //开始时间
  start:Date;

  //结束时间
  end: Date;

  //清空查询接口
  selectNull() {
    this.search = {
      urname: '',
      company: '',
      wiskind: '',
      start: '',
      end: '',
      district: '',
      devfacmod: '',
      aurname:'',
      acompany:'',
      awiskind:''
    };
    this.start = null;
    this.end = null;
    this.startmax = new Date();
    this.endmax = new Date();
    this.startmin = null;
    this.endmin = null;
    this.active = [this.items[0]];
  }

  //查询所有访问地区及设备
  querylist(){
      this.getgrid()
      this.colse();
  }

    //时间转换
    datezhuanhuan(date){
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    }

  //用户列表
  results;

  //查询用户
  searchu(value: any): void {
    this.userApi.usersearch2(value.query).then(date => {
      this.results = [];
      date.json().forEach(element => {
        this.results.push({
          name: element.realname,
          code: element.id
        })
      });
    }, err => {
      console.log(err);
    });
  }

  //用户公司列表
  results2: any[];

  //查询用户公司
  searchc(value: any): void {
    this.userApi.searchCompany(value.query).then(date => {
      this.results2 = [];
      date.json().forEach(element => {
        this.results2.push({
          name: element.company,
          code: element.id
        })
      });
    }, err => {
      console.log(err);

    });
  }

  //代理用户列表
  results3;

  //查询代理用户
  searchau(value: any): void {
    this.userApi.usersearch2(value.query).then(date => {
      this.results3 = [];
      date.json().forEach(element => {
        this.results3.push({
          name: element.realname,
          code: element.id
        })
      });
    }, err => {
      console.log(err);
    });
  }

  //代理用户公司列表
  results4: any[];

  //查询代理用户公司
  searchac(value: any): void {
    this.userApi.searchCompany(value.query).then(date => {
      this.results4 = [];
      date.json().forEach(element => {
        this.results4.push({
          name: element.company,
          code: element.id
        })
      });
    }, err => {
      console.log(err);

    });
  }

  //选择用户类型
  selected(value) {
    if (value.id == 1) this.search['wiskind'] = '';
    if (value.id == 2) this.search['wiskind'] = 1;
    if (value.id == 3) this.search['wiskind'] = 0;
  }

  //选择代理用户类型
  selecteda(value) {
    if (value.id == 1) this.search['awiskind'] = '';
    if (value.id == 2) this.search['awiskind'] = 1;
    if (value.id == 3) this.search['awiskind'] = 0;
  }

  //用户类型数组
  items: any = [{ id: 1, text: '全部用户' }, { id: 2, text: '内部用户' }, { id: 3, text: '外部用户' }];
  
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

  //选择结束时间
  selectend(){
    this.startmax = this.end;
    this.startmin = new Date(this.end.getTime() - 6 * 24 * 3600000);
  }
  // //开始时间最大时间
  // startmax(){
  //   let data;
  //   if(this.end){
  //     data = this.end;
  //   }else{
  //     data = new Date();
  //   }
  //   console.log(data);
    
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
