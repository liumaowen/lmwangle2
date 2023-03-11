import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from 'app/core/settings/settings.service';
import { XiaoshouapiService } from '../../xiaoshouapi.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wuliuorderimport',
  templateUrl: './wuliuorderimport.component.html',
  styleUrls: ['./wuliuorderimport.component.scss']
})
export class WuliuorderimportComponent implements OnInit {
  @ViewChild('matchcarModal') private matchcarModal: ModalDirective;
  @ViewChild('addrdialog') private addrdialog: ModalDirective;
  search: any;
  parentthis: any;
  gridOptions: GridOptions;
  matchcarForm: FormGroup;
  destList: any = []; // 客户卸货地址地址
  transtypes: any = [{ value: 1, label: '汽运' }, { value: 2, label: '铁运' }, { value: 3, label: '船运' }];
  matchcar: any = {};
  isbaojiadisabled = false;
  isstartdisabled = false;
  provinces: any = [];
  citys: any = [];
  countys: any = [];
  provinces1 = []; // 起始地省
  citys1 = []; // 起始地市
  countys1 = []; // 起始地县
  addr: any;
  isld: boolean;
  signrenObj: any = {};
  constructor(public bsModalRef: BsModalRef,
    public settings: SettingsService,
    private toast: ToasterService,
    private xiaoshouapi: XiaoshouapiService,
    private fb: FormBuilder,
    private matchcarAPi: MatchcarService,
    private addressparseService: AddressparseService,
    private classifyApi: ClassifyApiService,
    private router: Router,
    private datepipe: DatePipe) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowSelection: 'multiple',
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
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      // { cellStyle: { 'text-align': 'left' }, headerName: '选择', field: 'field', minWidth: 60, checkboxSelection: true },
      { cellStyle: { 'text-align': 'left' }, headerName: '选择', field: 'field', minWidth: 60, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'transporttype', minWidth: 90,
        valueGetter: (params) => {
          if (params.data.transporttype === 1) {
            return '汽运';
          } else if (params.data.transporttype === 2) {
            return '铁运';
          } else if (params.data.transporttype === 3) {
            return '船运';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, colId: 'price', headerName: '中标单价', field: 'price', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地 省', field: 'startprovincename', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地 市', field: 'startcityname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地 县', field: 'startcountyname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货地 省', field: 'provincename', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货地 市', field: 'cityname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货地 县', field: 'countyname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货地址', field: 'enddest', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货人', field: 'xhlianxiren', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货电话', field: 'xhlianxirenphone', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '指定收货签字人', field: 'isshouhuosign', minWidth: 90,
        valueGetter: (params) => {
          if (params.data) {
            return params.data.isshouhuosign ? '是' : '否';
          } else {
            return null;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '签字人', field: 'signuser', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '签字人电话', field: 'signphone', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 120,
        valueGetter: (params) => {
          if (params.data) {
            return this.datepipe.transform(params.data['cdate'], 'y-MM-dd HH:mm');
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价人', field: 'notifiername', minWidth: 90 }
    ];
    this.matchcarForm = fb.group({
      xhlianxirenphone: [null, Validators.pattern('1[3|4|5|6|7|8|9|][0-9]{9}')],
      provinceid: [],
      cityid: [],
      countyid: [],
      startprovinceid: [],
      startcityid: [],
      startcountyid: [],
      destination: [],
      startarea: [],
      transtype: [],
      xhlianxiren: [],
      pingzheng: [],
      rukutaitou: [],
      isdiaofee: [],
      istuisong: [],
      isneedsale: [],
      beizhu: [],
      isshouhuosign: [false],
      signuser: [],
      signphone: [null, Validators.pattern('1[3|4|5|6|7|8|9|][0-9]{9}')],
    });

  }

  ngOnInit() {
    setTimeout(() => {
      this.getlist();
      this.getDestList(this.parentthis.buyerid).then(destlist => {
        this.destList = destlist;
      });
      this.getprovince();
    }, 0);
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
  }
  /**获取物流竞价明细 */
  getlist() {
    this.xiaoshouapi.getwuliuorderlist(this.search).then(data => {
      this.gridOptions.api.setRowData(data['wuliuorderList']);
      if (!data['wuliuorderList'].length) {
        this.toast.pop('info', '没有查询到当前订单的物流报价！');
      }
    });
  }
  /**获取当前客户的地址 */
  getDestList(buyerid) {
    return new Promise((resolve: (data) => void) => {
      this.matchcarAPi.getdestList(buyerid).then(data => {
        resolve(data);
      });
    });
  }
  /**获取省 */
  getprovince() {
    this.provinces = [];
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        });
        this.citys = [];
        this.countys = [];
        this.provinces1 = this.provinces;
        this.citys1 = [];
        this.countys1 = [];
      });
    });
  }
  selectNull() {
    this.matchcar['transtype'] = '';
    this.matchcar['destination'] = '';
    this.matchcar['rukutaitou'] = '';
    this.matchcar['pingzheng'] = '';
    this.matchcar['isdiaofee'] = '';
    this.matchcar['istuisong'] = false;
    this.matchcar['beizhu'] = '';
    this.matchcar['isneedsale'] = false;
    this.matchcar['isshouhuosign'] = false;
    this.citys = [];
    this.countys = [];
    this.isbaojiadisabled = false;
  }

  /**创建约车单 */
  openmatchcar() {
    const wuliuorders = new Array();
    const wuliuorderids = new Array();
    let endaddr = null, transporttype = null, provinceid = null, cityid = null, countyid = null, tihuoaddr = '',
      xhlianxiren = '', xhlianxirenphone = '', startprovinceid = null, startcityid = null, startcountyid = null,
      signuser = '', signphone = '', isshouhuosign = false;
    const selected = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < selected.length; i++) {
      if (selected[i].data && selected[i].selected) {
        wuliuorders.push(selected[i].data);
        wuliuorderids.push(selected[i].data.id);
      }
    }
    if (!wuliuorders.length) {
      this.toast.pop('warning', '请选择竞价明细！');
      return;
    }
    this.matchcar = {};
    this.selectNull();
    if (this.parentthis.matchcar['cangkuid']) {
      this.matchcar['cangkuid'] = JSON.parse(JSON.stringify(this.parentthis.matchcar['cangkuid']));
    }
    this.matchcar['orderdetids'] = JSON.parse(JSON.stringify(this.parentthis.matchcar['orderdetids']));
    this.matchcar['wuliuorderids'] = wuliuorderids;
    const obj = {};
    if (wuliuorders.length > 1) {
      for (let index = 0; index < wuliuorders.length; index++) {
        const ele = wuliuorders[index];
        const key = ele['provinceid'] + '#' + ele['countyid'] + '#' + ele['cityid'] + '#' + ele['transporttype'];
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          obj[key] = key;
        }
      }
    }
    if (wuliuorders.length && wuliuorders.length === 1 || Object.getOwnPropertyNames(obj).length === 1) {
      endaddr = wuliuorders[0]['enddest'];
      transporttype = wuliuorders[0]['transporttype'];
      provinceid = wuliuorders[0]['provinceid'];
      countyid = wuliuorders[0]['countyid'];
      cityid = wuliuorders[0]['cityid'];
      startprovinceid = wuliuorders[0]['startprovinceid'];
      startcountyid = wuliuorders[0]['startcountyid'];
      startcityid = wuliuorders[0]['startcityid'];
      xhlianxiren = wuliuorders[0]['xhlianxiren'];
      xhlianxirenphone = wuliuorders[0]['xhlianxirenphone'];
      signuser = wuliuorders[0]['signuser'];
      signphone = wuliuorders[0]['signphone'];
      signphone = wuliuorders[0]['signphone'];
      isshouhuosign = wuliuorders[0]['isshouhuosign'];
      const startprovincename = wuliuorders[0]['startprovincename'] ? wuliuorders[0]['startprovincename'] : '';
      const startcityname = wuliuorders[0]['startcityname'] ? wuliuorders[0]['startcityname'] : '';
      const startcountyname = wuliuorders[0]['startcountyname'] ? wuliuorders[0]['startcountyname'] : '';
      tihuoaddr = startprovincename + startcityname + startcountyname;
      this.destList.push({ label: endaddr, value: endaddr });
      this.matchcar['wuliuorderids'] = wuliuorderids;
      this.matchcar['destination'] = endaddr;
      this.matchcar['transtype'] = transporttype;
      this.matchcar['provinceid'] = provinceid;
      this.matchcar['startprovinceid'] = startprovinceid;
      this.matchcar['xhlianxiren'] = xhlianxiren;
      this.signrenObj['signuser'] = signuser;
      this.signrenObj['signphone'] = signphone;
      this.matchcar['isshouhuosign'] = isshouhuosign;
      this.isshouhuosignchange();
      // 手机号赋值后验证
      this.matchcarForm.get('xhlianxirenphone').patchValue(xhlianxirenphone);
      this.matchcarForm.get('xhlianxirenphone').markAsDirty();
      this.matchcar['startarea'] = tihuoaddr;
      // this.matchcar['wuliuorderid'] = wuliuorders[0]['id'];
      this.getpcc(this.matchcar['provinceid'], this.citys).then(cityData => {
        if (cityid) {
          if (cityData.length) {
            this.matchcar['cityid'] = cityid;
            this.getpcc(this.matchcar['cityid'], this.countys).then(countyData => {
              if (countyid) {
                if (countyData.length) {
                  this.matchcar['countyid'] = countyid;
                }
              }
            });
          }
        }
      });
      if (this.matchcar['startprovinceid']) {
        this.getpcc(this.matchcar['startprovinceid'], this.citys1).then(cityData => {
          if (startcityid) {
            if (cityData.length) {
              this.matchcar['startcityid'] = startcityid;
              this.getpcc(this.matchcar['startcityid'], this.countys1).then(countyData => {
                if (startcountyid) {
                  if (countyData.length) {
                    this.matchcar['startcountyid'] = startcountyid;
                  }
                }
              });
            }
          }
        });
        this.isstartdisabled = true;
        this.matchcarForm.get('startarea').disable();
      } else {
        this.isstartdisabled = false;
        this.matchcarForm.get('startarea').enable();
      }
      this.isbaojiadisabled = true;
    } else {
      this.isstartdisabled = false;
      this.matchcarForm.get('startarea').enable();
    }
    this.matchcarModal.show();
  }
  closeMatchcar() {
    this.matchcarModal.hide();
  }
  /**
   * 根据详细地址自动识别省市县
   */
  selecteddes(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      console.log(addressObj);
      if (addressObj['name']) {
        this.matchcar['xhlianxiren'] = addressObj['name'];
      }
      if (addressObj['phone']) {
        this.matchcar['xhlianxirenphone'] = addressObj['phone'];
      }
      this.citys = []; this.countys = [];
      this.matchcar['provinceid'] = '';
      this.matchcar['cityid'] = '';
      this.matchcar['countyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.matchcar['provinceid'] = addressObj['provinceValue'];
          this.getpcc(this.matchcar['provinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.matchcar['cityid'] = addressObj['cityValue'];
                this.getpcc(this.matchcar['cityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['id'] === Number(addressObj['countyValue']))) {
                        this.matchcar['countyid'] = addressObj['countyValue'];
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
  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyApi.getChildrenTree({ pid: pid }).then((data) => {
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
  getcity() {
    this.citys = [];
    delete this.matchcar['cityid'];
    delete this.matchcar['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.matchcar['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }

  getcounty() {
    this.countys = [];
    delete this.matchcar['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.matchcar['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  /**
   * 根据起始地自动识别省市县
   */
  selectedenddest1(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys1 = []; this.countys1 = [];
      this.matchcar['startprovinceid'] = '';
      this.matchcar['startcityid'] = '';
      this.matchcar['startcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces1.length) {
          this.matchcar['startprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.matchcar['startprovinceid'], this.citys1).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.matchcar['startcityid'] = addressObj['cityValue'];
                this.getpcc(this.matchcar['startcityid'], this.countys1).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.matchcar['startcountyid'] = addressObj['countyValue'];
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
  // 起始地省改变事件
  getcity1() {
    this.citys1 = [];
    delete this.matchcar['startcityid'];
    delete this.matchcar['startcountyid'];
    this.classifyApi.getChildrenTree({ pid: this.matchcar['startprovinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys1.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }
  // 起始地市改变事件
  getcounty1() {
    this.countys1 = [];
    delete this.matchcar['startcountyid'];
    this.classifyApi.getChildrenTree({ pid: this.matchcar['startcityid'] }).then((data) => {
      data.forEach(element => {
        this.countys1.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  addAddrDialog() {
    this.addrdialog.show();
  }
  addrdialogclose() {
    this.addrdialog.hide();
  }
  addAddr() {
    this.destList.push({ label: this.addr.code, value: this.addr.code });
    this.matchcar['destination'] = this.addr.code;
    this.addrdialogclose();
    if (this.matchcar['destination']) {
      this.selecteddes(this.matchcar['destination']);
    }
  }
  creatematchcar() {
    this.matchcar['isld'] = this.parentthis['isld'];
    if (!this.matchcar['transtype']) {
      this.toast.pop('warning', '请选择运输方式!');
      return;
    }
    if (this.provinces1.length) {
      if (!this.matchcar['startprovinceid']) {
        this.toast.pop('warning', '请把起始地省填写完成!');
        return;
      }
    }
    if (this.citys1.length) {
      if (!this.matchcar['startcityid']) {
        this.toast.pop('warning', '请把起始地市填写完成!');
        return;
      }
    }
    if (this.countys1.length) {
      if (!this.matchcar['startcountyid']) {
        this.toast.pop('warning', '请把起始地县填写完成!');
        return;
      }
    }
    if (!this.matchcar['destination']) {
      this.toast.pop('warning', '请选择具体卸货地址!');
      return;
    }
    if (this.provinces.length) {
      if (!this.matchcar['provinceid']) {
        this.toast.pop('warning', '请把省填写完成!');
        return;
      }
    }
    if (this.citys.length) {
      if (!this.matchcar['cityid']) {
        this.toast.pop('warning', '请把市填写完成!');
        return;
      }
    }
    if (this.countys.length) {
      if (!this.matchcar['countyid']) {
        this.toast.pop('warning', '请把县填写完成!');
        return;
      }
    }
    if (!this.matchcar['xhlianxiren']) {
      this.toast.pop('warning', '请填写卸货联系人!');
      return;
    }
    if (!this.matchcar['xhlianxirenphone']) {
      this.toast.pop('warning', '请填写卸货电话!');
      return;
    }
    if (!this.matchcar['rukutaitou']) {
      this.toast.pop('warning', '请填写入库抬头!');
      return;
    }
    if (!this.matchcar['pingzheng']) {
      this.toast.pop('warning', '请填写提货凭证!');
      return;
    }
    if (!this.matchcar['wuliuorderids']) {
      this.toast.pop('warning', '请选择物流竞价明细!');
      return;
    }
    if (this.matchcar['isshouhuosign']) {
      if (!this.matchcar['signuser']) {
        this.toast.pop('warning', '请填写签字人!');
        return;
      }
      if (!this.matchcar['signphone']) {
        this.toast.pop('warning', '请填写签字人电话!');
        return;
      }
    }
    // 省市县id转为number
    if (this.matchcar['provinceid']) {
      this.matchcar['provinceid'] = Number(this.matchcar['provinceid']);
    }
    if (this.matchcar['cityid']) {
      this.matchcar['cityid'] = Number(this.matchcar['cityid']);
    }
    if (this.matchcar['countyid']) {
      this.matchcar['countyid'] = Number(this.matchcar['countyid']);
    }
    this.matchcarAPi.createMatchcar(this.matchcar).then(data => {
      this.closeMatchcar(); // 关闭弹出框
      this.bsModalRef.hide();
      this.toast.pop('success', '约车单创建成功！');
      this.router.navigate(['/matchcar/detail/', data['id']]);
    });
  }
  /**是否收货人签字点击 */
  isshouhuosignchange() {
    if (this.matchcar['isshouhuosign']) {
      this.matchcar['signuser'] = this.signrenObj['signuser'];
      this.matchcar['signphone'] = this.signrenObj['signphone'];
      // 收货人手机号赋值后验证
      this.matchcarForm.get('signphone').patchValue(this.matchcar['signphone']);
      this.matchcarForm.get('signphone').markAsDirty();
    } else {
      this.matchcar['signuser'] = '';
      this.matchcar['signphone'] = '';
      // 收货人手机号赋值后验证
      this.matchcarForm.get('signphone').patchValue(null);
      this.matchcarForm.get('signphone').markAsDirty();
    }
  }

  results: any;
  searchplace(e) {
    console.log(e.query);
    this.matchcarAPi.getSuggestionPlace(e.query).then(data => {
      console.log(data);
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.title + '\r\n' + element.address,
          code: element.address + element.title
        });
      });
    });

  }
}
