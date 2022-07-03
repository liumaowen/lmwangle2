import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { YunfeeapiService } from '../yunfeeapi.service';

@Component({
  selector: 'app-yunpricecankao',
  templateUrl: './yunpricecankao.component.html',
  styleUrls: ['./yunpricecankao.component.scss']
})
export class YunpricecankaoComponent implements OnInit {
  gridOptions: GridOptions;
  start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值
  end: Date;
  maxDate = new Date();
  search: any = { start: this.datePipe.transform(this.start, 'y-MM-dd'), end: ''};
  provinces1 = []; // 起始地省
  citys1 = []; // 起始地市
  countys1 = []; // 起始地县
  provinces = []; // 目的地省
  citys = []; // 目的地市
  countys = []; // 目的地县
  @ViewChild('classicModal') private classicModal: ModalDirective;
  constructor(
    public settings: SettingsService,
    private toast: ToasterService,
    private yunfeeApi: YunfeeapiService,
    private datePipe: DatePipe,
    private userapi: UserapiService,
    private addressparseService: AddressparseService,
    private classifyapi: ClassifyApiService,
  ) {
    this.gridOptions = {
      enableFilter: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableRangeSelection: true,
      getContextMenuItems: this.settings.getContextMenuItems,
      localeText: this.settings.LOCALETEXT,
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true // 焦点离开停止编辑
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startarea', minWidth: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 省', field: 'endprovincename', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 市', field: 'endcityname', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 县', field: 'endcountyname', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 86},
      { cellStyle: { 'text-align': 'center' }, headerName: '运输类型', field: 'yuntype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '竞价方式', field: 'ist', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '系统价格', field: 'price', minWidth: 80},
      { cellStyle: { 'text-align': 'center' }, headerName: '内部价格', field: 'innerprice', minWidth: 80, colId: 'innerprice',
        editable: (params) => true,
        onCellValueChanged: (params) => { this.modifyprice(params); }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '运费单位', field: 'wlcustomername', minWidth: 140},
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', minWidth: 80 },
    ];
    this.getMyRole();
  }
  // 获取用户角色，如果登陆的用户是业务员，设置为不可见
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    if (myrole.some(item => item === 10)) {
      this.gridOptions.columnDefs.forEach((colde: ColDef) => {
        if (colde.colId === 'innerprice') {
          colde.hide = true;
          colde.suppressToolPanel = true;
        }
      });
    }
  }
  ngOnInit() {
    this.getlist();
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
  }
  getlist() {
    this.yunfeeApi.getcankaolist(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  showquery() {
    delete this.search['startarea'];
    delete this.search['startprovinceid'];
    delete this.search['startcityid'];
    delete this.search['startcountyid'];
    delete this.search['enddest'];
    delete this.search['endprovinceid'];
    delete this.search['endcityid'];
    delete this.search['endcountyid'];
    this.getProvince();
    this.classicModal.show();
  }
  selectNull() {
    this.search = { start: this.datePipe.transform(this.start, 'y-MM-dd'), end: ''};
  }
  query() {
    if (this.start) {
      this.search.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.search.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.search.end = '';
      }
      this.getlist();
      this.hideclassicModal();
    }
  }
  hideclassicModal() {
    this.classicModal.hide();
  }

  // 修改价格
  modifyprice(params) {
    if (params.oldValue === params.newValue) {
      return;
    }
    if (confirm('确定要修改吗？')) {
      this.yunfeeApi.modifyprice(params.data.id, { innerprice: params.newValue }).then(data => {
        this.toast.pop('success', '修改成功');
        this.getlist();
      }, err => {
        params.node.data.innerprice = params.oldValue;
        params.node.setData(params.node.data);
      });
    } else {
      params.node.data.innerprice = params.oldValue;
      params.node.setData(params.node.data);
    }
  }
  /**
   * 根据详细地址自动识别省市县
   */
   selectedenddest(destination, provinceid, cityid, countyid, provinces, citys, countys) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this[citys] = []; this[countys] = [];
      this.search[provinceid] = '';
      this.search[cityid] = '';
      this.search[countyid] = '';
      if (addressObj['provinceValue']) {
        if (provinces.length) {
          this.search[provinceid] = addressObj['provinceValue'];
          this.getpcc(this.search[provinceid], this[citys]).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.search[cityid] = addressObj['cityValue'];
                this.getpcc(this.search[cityid], this[countys]).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.search[countyid] = addressObj['countyValue'];
                      }
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }
  getProvince() {
    this.provinces = [];
    this.classifyapi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys = [];
      this.countys = [];
      this.provinces1 = this.provinces;
      this.citys1 = [];
      this.countys1 = [];
    });
  }
  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyapi.getChildrenTree({ pid: pid }).then((data) => {
        data.forEach(element => {
          pccname.push({
            label: element.label,
            value: element.id + ''
          });
        });
        resolve(pccname);
      });
    });
  }
  // 起始地省改变事件
  getcity(citys,countys,provinceid,cityid,countyid) {
    this[citys] = [];
    delete this.search[cityid];
    delete this.search[countyid];
    this.classifyapi.getChildrenTree({ pid: this.search[provinceid] }).then((data) => {
      data.forEach(element => {
        this[citys].push({
          label: element.label,
          value: element.id
        });
      });
      this[countys] = [];
    });
  }
  // 起始地市改变事件
  getcounty(countys,cityid,countyid) {
    this[countys] = [];
    delete this.search[countyid];
    this.classifyapi.getChildrenTree({ pid: this.search[cityid] }).then((data) => {
      data.forEach(element => {
        this[countys].push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
}
