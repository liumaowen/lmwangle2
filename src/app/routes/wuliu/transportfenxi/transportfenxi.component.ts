import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { WuliuscoreapiService } from '../wuliuscore/wuliuscoreapi.service';
import { ToasterService } from 'angular2-toaster';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { AddressparseService } from 'app/dnn/service/address_parse';


@Component({
  selector: 'app-transportfenxi',
  templateUrl: './transportfenxi.component.html',
  styleUrls: ['./transportfenxi.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class TransportfenxiComponent implements OnInit {
  private gridApi;
  search: any = {
    month: '',
    transporttype: '',
    startprovinceid: '',
    startcityid: '',
    startcountyid: '',
    endprovinceid: '',
    endcityid: '',
    endcountyid: '',
    wlcustomerid: '',
    weightrange: ''
  };
  // aggird表格原型
  gridOptions: GridOptions;
  provinces = [];
  citys = [];
  countys = [];
  provinces1 = [];
  citys1 = [];
  countys1 = [];
  transporttype = [{ label: '请选择。。。', value: null }, { label: '汽运', value: 1 }, { label: '铁运', value: 2 }, { label: '船运', value: 3 }];
  weightranges: any = []; // 吨位区间
  wlcustomer = {};
  currmonth: any = '';
  // 弹窗
  @ViewChild('classicModal') private classicModel: ModalDirective;
  constructor(public settings: SettingsService,
    private wuliuscoreapiService: WuliuscoreapiService,
    private toast: ToasterService,
    private datepipe: DatePipe,
    private classifyapi: ClassifyApiService,
    private addressparseService: AddressparseService,) {
    // aggird实例对象
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
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
      localeText: this.settings.LOCALETEXT
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'month', minWidth: 100
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'transporttype', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startdest', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地', field: 'enddest', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运费单位', field: 'wlcustomername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价平均值环比', field: 'avginnerpricehuanbi', minWidth: 115 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价平均值同比', field: 'avginnerpricetongbi', minWidth: 115 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价平均值', field: 'avginnerprice', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '总量环比', field: 'sumweighthuanbi', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '总量同比', field: 'sumweighttongbi', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '总量', field: 'sumweight', minWidth: 100},
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '总金额', field: 'suminnerjine', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '路线', field: 'luxian', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '去年运输量', field: 'lastsumweight', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '去年运输总金额', field: 'jinesum', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '去年单价平均值', field: 'avginnerprice2', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地区域', field: 'startarea', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地区域', field: 'endarea', minWidth: 100 },
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
  }
  getlist() {
    this.wuliuscoreapiService.gettransport(this.search).then(data => {
      this.classicModel.hide();
      this.gridOptions.api.setRowData(data);
    });
  }
  /**选择月份 */
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
    this.currmonth = this.search['month'];
  }
  selectendmonth(value){
    this.search['endmonth'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectNull() {
    this.search = {
      transporttype: '',
      startprovinceid: '',
      startcityid: '',
      startcountyid: '',
      endprovinceid: '',
      endcityid: '',
      endcountyid: '',
      wlcustomerid: '',
      weightrange: ''
    };
    this.wlcustomer = {};
    this.getweightranges();
    this.getProvince();
    this.search['month'] = this.currmonth;
  }
  showDialog() {
    this.selectNull();
    this.search['isluxian'] = 1;
    this.search['iscustomer'] = 1;
    this.classicModel.show();
  }
  // 关闭弹窗
  coles() {
    this.classicModel.hide();
  }
  querylist() {
    if (!this.search['month']) {
      this.toast.pop('warning', '请选择日期');
      return;
    }
    if (!this.search['endmonth']) {
      this.toast.pop('warning', '请选择结束日期');
      return;
    }
    if (typeof (this.wlcustomer) === 'string' || !this.wlcustomer) {
      this.search['wlcustomerid'] = '';
    } else if (typeof (this.wlcustomer) === 'object' && this.wlcustomer['code']) {
      this.search['wlcustomerid'] = this.wlcustomer['code'];
    }
    if(!this.search['isluxian'] && !this.search['iscustomer']){
      this.toast.pop('warning', '路线和运费单位至少选择一项！');
      return;
    }
    this.getlist();
    this.classicModel.hide();
  }
  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
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
  getcity1(obj) {
    this.citys = [];
    delete obj['startcityid'];
    delete obj['startcountyid'];
    this.classifyapi.getChildrenTree({ pid: obj['startprovinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }

  getcounty1(obj) {
    this.countys = [];
    delete obj['startcountyid'];
    this.classifyapi.getChildrenTree({ pid: obj['startcityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  getcity2(obj) {
    this.citys1 = [];
    delete obj['endcityid'];
    delete obj['endcountyid'];
    this.classifyapi.getChildrenTree({ pid: obj['endprovinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys1.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys1 = [];
    });
  }

  getcounty2(obj) {
    this.countys1 = [];
    delete obj['endcountyid'];
    this.classifyapi.getChildrenTree({ pid: obj['endcityid'] }).then((data) => {
      data.forEach(element => {
        this.countys1.push({
          label: element.label,
          value: element.id
        });
      });
    });
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
  // 吨位区间
  getweightranges() {
    this.weightranges = [{ label: '请选择。。。', value: '' }];
    this.classifyapi.listclassify('wuliu_transportfenxi').then(data => {
      data.forEach(element => {
        this.weightranges.push({
          label: element.name,
          value: element.value
        });
      });
    });
  }
  /**
 * 起始地根据详细地址自动识别省市县
 */
    selectedenddest(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys = []; this.countys = [];
      this.search['startprovinceid'] = '';
      this.search['startcityid'] = '';
      this.search['startcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.search['startprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.search['startprovinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.search['startcityid'] = addressObj['cityValue'];
                this.getpcc(this.search['startcityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.search['startcountyid'] = addressObj['countyValue'];
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
  /**
   * 目的地根据详细地址自动识别省市县
   */
  selectedenddest1(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys1 = []; this.countys1 = [];
      this.search['endprovinceid'] = '';
      this.search['endcityid'] = '';
      this.search['endcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces1.length) {
          this.search['endprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.search['endprovinceid'], this.citys1).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.search['endcityid'] = addressObj['cityValue'];
                this.getpcc(this.search['endcityid'], this.countys1).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.search['endcountyid'] = addressObj['countyValue'];
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
}
