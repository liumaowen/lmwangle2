import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { GridOptions } from 'ag-grid';
import { DatePipe } from '@angular/common';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-noticewuliuyuan',
  templateUrl: './noticewuliuyuan.component.html',
  styleUrls: ['./noticewuliuyuan.component.scss']
})
export class NoticewuliuyuanComponent implements OnInit {
  wuliunotice: any = { enddest: '', id: null, wuliuuserid: null, transporttype: null, ispieces: false };
  selectQihuodetWuliubaojia: any = [];
  parentThis;
  addr = {};
  provinces1 = []; // 起始地省
  citys1 = []; // 起始地市
  countys1 = []; // 起始地县
  provinces = []; // 目的地省
  citys = []; // 目的地市
  countys = []; // 目的地县
  transporttype = [{ label: '请选择。。。', value: null }, { label: '汽运', value: 1 }, { label: '铁运', value: 2 }, { label: '船运', value: 3 }];
  cuser = {};
  wuluiorderlist: any = [];
  requestparams = {};
  newdate = new Date();
  gridOptions: GridOptions;
  @ViewChild('addProModal') private addProModal: ModalDirective;
  addPro: any = {};
  types = [{ value: '纵剪', label: '纵剪' }, { value: '横切', label: '横切' }, { value: '纵剪+横切', label: '纵剪+横切' }];
  rowData: any = [];
  selectRowData: any = {};
  slitlist: any = []; // 加工成品规格
  cangkus = [];
  results: any;
  constructor(
    public bsModalRef: BsModalRef,
    public settings: SettingsService,
    private toast: ToasterService,
    private addressparseService: AddressparseService,
    private classifyapi: ClassifyApiService,
    private qihuoapi: QihuoService,
    private datepipe: DatePipe,
    private matchcarApi: MatchcarService,
    private userapi: UserapiService) {
    this.gridOptions = {
      enableFilter: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableRangeSelection: true,
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
      getContextMenuItems: this.settings.getContextMenuItems,
      localeText: this.settings.LOCALETEXT,
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true // 焦点离开停止编辑
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单量', field: 'weight', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已报价量', field: 'sumyibaojia', minWidth: 70 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '可报价量', field: 'baojialiang', minWidth: 70,
        editable: (params) => params.node.data.isedit,
        cellRenderer: (params) => {
          if (params.node.data.isedit) {
            return `<a>${params.data.baojialiang}</a>`;
          } else {
            return params.data.baojialiang + '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否加工', field: 'isjiagongname', minWidth: 70, editable: true,
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: { values: ['是', '否'] },
        onCellValueChanged: (params) => this.isjiagongvaluechanged(params),
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '加工成品规格', field: 'cpguige', minWidth: 100,
        cellRenderer: (params) => {
          if (params.node.data.iscpguige) {
            if (!params.node.data.cpguige) {
              return '<a target="_blank">添加</a>';
            } else {
              return `<a target="_blank">${params.node.data.cpguige}</a>`;
            }
          } else {
            return null;
          }
        },
        onCellClicked: (params) => {
          if (params.node.data.iscpguige) {
            this.showaddProModal(params);
          }
        }
      }
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      this.shownoticewuliuyuan();
      this.getcangku();
    }, 0);
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
  }
  /**选择物流员弹窗 */
  shownoticewuliuyuan() {
    this.wuliunotice = { ispieces: false, isshouhuosign: false };
    this.selectQihuodetWuliubaojia = this.parentThis.noticewuliuparams['qihuodets'];
    // 竞价的单据来源，1是现货,5是调拨,6是加工,7是在途 新增7 by cl 20210630
    this.wuliunotice['datasource'] = this.parentThis.noticewuliuparams['datasource'];
    this.rowData = this.selectQihuodetWuliubaojia;
    this.selectQihuodetWuliubaojia.forEach(ele => {
      ele['isjiagongname'] = '否';
      ele['isjiagong'] = false;
      if (this.wuliunotice['datasource'] === 1 || this.wuliunotice['datasource'] === 5) {
        ele.isedit = false;
      } else {
        ele.isedit = true;
      }
    });
    this.wuliunotice['detids'] = this.parentThis.noticewuliuparams['detids'];
    this.getProvince();
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
  /**
   * 根据详细地址自动识别省市县
   */
  selectedenddest(destination) {
    destination = destination.name;
    //this.wuliunotice['enddest'] = destination;
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys = []; this.countys = [];
      this.wuliunotice['provinceid'] = '';
      this.wuliunotice['cityid'] = '';
      this.wuliunotice['countyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.wuliunotice['provinceid'] = addressObj['provinceValue'];
          this.getpcc(this.wuliunotice['provinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.wuliunotice['cityid'] = addressObj['cityValue'];
                this.getpcc(this.wuliunotice['cityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.wuliunotice['countyid'] = addressObj['countyValue'];
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
  // 调用接口货物地址
  searchplace(e) {
    this.matchcarApi.getSuggestionPlace(e.query).then(data => {
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.address + ' ' + element.title,
          code: element.address
        });
      });
    });
  }
  /**
   * 根据起始地自动识别省市县
   */
  selectedenddest1(destination) {
    console.log(destination);
    destination = destination.code;
    // this.wuliunotice['startarea'] = destination;
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys1 = []; this.countys1 = [];
      this.wuliunotice['startprovinceid'] = '';
      this.wuliunotice['startcityid'] = '';
      this.wuliunotice['startcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces1.length) {
          this.wuliunotice['startprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.wuliunotice['startprovinceid'], this.citys1).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.wuliunotice['startcityid'] = addressObj['cityValue'];
                this.getpcc(this.wuliunotice['startcityid'], this.countys1).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.wuliunotice['startcountyid'] = addressObj['countyValue'];
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
  getcity2() {
    this.citys = [];
    delete this.wuliunotice['cityid'];
    delete this.wuliunotice['countyid'];
    this.classifyapi.getChildrenTree({ pid: this.wuliunotice['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }

  getcounty2() {
    this.countys = [];
    delete this.wuliunotice['countyid'];
    this.classifyapi.getChildrenTree({ pid: this.wuliunotice['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  // 起始地省改变事件
  getcity1() {
    this.citys1 = [];
    delete this.wuliunotice['startcityid'];
    delete this.wuliunotice['startcountyid'];
    this.classifyapi.getChildrenTree({ pid: this.wuliunotice['startprovinceid'] }).then((data) => {
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
    delete this.wuliunotice['startcountyid'];
    this.classifyapi.getChildrenTree({ pid: this.wuliunotice['startcityid'] }).then((data) => {
      data.forEach(element => {
        this.countys1.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  savenoticewuliuyuan() {
    if(!this.wuliunotice['startcangkuid']){
      if (this.provinces1.length) {
        if (!this.wuliunotice['startprovinceid']) {
          this.toast.pop('warning', '请把起始地省填写完成!');
          return;
        }
      }
      if (this.citys1.length) {
        if (!this.wuliunotice['startcityid']) {
          this.toast.pop('warning', '请把起始地市填写完成!');
          return;
        }
      }
      if (this.countys1.length) {
        if (!this.wuliunotice['startcountyid']) {
          this.toast.pop('warning', '请把起始地县填写完成!');
          return;
        }
      }
    }
    if (this.wuliunotice['transporttype'] === undefined || this.wuliunotice['transporttype'] === null) {
      this.toast.pop('warning', '请选择运输类型！！！');
      return;
    }
    if (!this.wuliunotice['fahuodate']) {
      this.toast.pop('warning', '请选择预计发货时间！！！');
      return;
    }
    this.wuliunotice['fahuodate'] = this.datepipe.transform(this.wuliunotice['fahuodate'], 'y-MM-dd');
    if (typeof (this.cuser) === 'string' || !this.cuser) {
      this.wuliunotice['wuliuuserid'] = '';
    } else if (typeof (this.cuser) === 'object') {
      this.wuliunotice['wuliuuserid'] = this.cuser['code'];
    }
    if (!this.wuliunotice['wuliuuserid']) {
      this.toast.pop('warning', '请选择物流专员！！！');
      return;
    }
    if(!this.wuliunotice['endcangkuid']){
      // if (!this.wuliunotice['enddest']) {
      //   this.toast.pop('warning', '请输入卸货地址！！！');
      //   return;
      // }
      if (this.provinces.length) {
        if (!this.wuliunotice['provinceid']) {
          this.toast.pop('warning', '请把卸货地省填写完成!');
          return;
        }
      }
      if (this.citys.length) {
        if (!this.wuliunotice['cityid']) {
          this.toast.pop('warning', '请把卸货地市填写完成!');
          return;
        }
      }
      if (this.countys.length) {
        if (!this.wuliunotice['countyid']) {
          this.toast.pop('warning', '请把卸货地县填写完成!');
          return;
        }
      }
    }
    if (this.wuliunotice['isshouhuosign']) {
      if (!this.wuliunotice['signuser'] || !this.wuliunotice['signphone']) {
        this.toast.pop('warning', '请填写收货签字人信息!');
        return;
      }
    } else {
      this.wuliunotice['signuser'] = null;
      this.wuliunotice['signphone'] = null;
    }
    if (this.wuliunotice['datasource'] === 7) {
      if (!this.wuliunotice['startcangkuid'] || !this.wuliunotice['endcangkuid']) {
        this.toast.pop('warning', '在途通知物流员专员时必填仓库!');
        return;
      }
    }
    for (let index = 0; index < this.rowData.length; index++) {
      const row = index + 1;
      const element = this.rowData[index];
      if (isNaN(Number(element.baojialiang))) {
        this.toast.pop('warning', '可报价量必须是数字!');
        return;
      }
      if (Number(element.baojialiang) <= 0) {
        this.toast.pop('warning', '可报价量必须大于0的数字!');
        return;
      }
      element['isjiagong'] = element['isjiagongname'] === '是' ? true : false;
      if (element['isjiagong'] && !element['cpguige']) {
        this.toast.pop('warning', '第' + row + '行是否加工选择“是”，加工成品规格必填!');
        return;
      }
    }
    if(this.wuliunotice['startarea']){
      this.wuliunotice['startarea'] = this.wuliunotice['startarea'].name;
    }
    if(this.wuliunotice['enddest']){
      this.wuliunotice['enddest'] = this.wuliunotice['enddest'].name;
    }
    let istixing = false;
    console.log(this.selectQihuodetWuliubaojia);
    console.log(123)
    for(let i = 0; i<this.selectQihuodetWuliubaojia.length;i++){
      if((this.parentThis.ordertitle === '期货订单' || this.parentThis.ordertitle === '期货加工订单') && this.selectQihuodetWuliubaojia[i].weight-this.selectQihuodetWuliubaojia[i].sumyibaojia<this.selectQihuodetWuliubaojia[i].baojialiang){
        istixing=true;
        console.log(istixing)
      }
    }
    if(istixing){
      // if(confirm('竞价量＞订货量-已报价量!您确定要继续竞价吗？')){
      //   this.wuliunotice['qihuodets'] = this.rowData;
      //   this.noticewuliuyuan(this.wuliunotice);
      //   return;
      // }
    sweetalert({
      title: '竞价量＞订货量-已报价量!您确定要继续竞价吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.wuliunotice['qihuodets'] = this.rowData;
      this.noticewuliuyuan(this.wuliunotice);
      sweetalert.close();
    });
    }else{
      this.wuliunotice['qihuodets'] = this.rowData;
      this.noticewuliuyuan(this.wuliunotice);
    }    
  }
  /**
   * 通知物流员
   * */
  noticewuliuyuan(searchparam) {
    if (searchparam['datasource'] && (searchparam['datasource'] === 1 || searchparam['datasource'] === 6)) {
      this.qihuoapi.createxhwuliuorder(searchparam).then(data => {
        this.parentThis.wuliunoticehide();
      });
    } else if (searchparam['datasource'] && searchparam['datasource'] === 5) {
      this.qihuoapi.createallotwuliuorder(searchparam).then(data => {
        this.parentThis.wuliunoticehide();
      });
    } else if (searchparam['datasource'] && searchparam['datasource'] === 7) {
      this.qihuoapi.createzaituwuliuorder(searchparam).then(data => {
        this.parentThis.wuliunoticehide();
      });
    } else {
      this.qihuoapi.noticewuliuyuan(searchparam).then(data => {
        this.parentThis.wuliunoticehide();
      });
    }
  }
  /**选择是否加工后 */
  isjiagongvaluechanged(params) {
    if (params.node.data.isjiagongname === '是') {
      params.node.data.iscpguige = true;
      params.node.data.isjiagong = true;
    } else {
      params.node.data.iscpguige = false;
      params.node.data.isjiagong = false;
      params.node.data.cpguige = null;
    }
    params.node.setData(params.node.data);
    this.gridOptions.api.refreshCells({ force: true });
  }
  /**打开成品规格弹窗 */
  showaddProModal(params) {
    this.addProModal.show();
    this.addPro = {};
    this.selectRowData = params.data;
  }
  hideaddProModal() {
    this.addProModal.hide();
  }
  addproductdet() {
    if (!this.slitlist.length) {
      if (!this.addPro['length']) {
        this.toast.pop('warning', '请输入长度!');
        return;
      }
      if (!this.addPro['width']) {
        this.toast.pop('warning', '请输入宽度!');
        return;
      }
      if (!this.addPro['houdu']) {
        this.toast.pop('warning', '请输入厚度!');
        return;
      }
      if (!this.addPro['jgtype']) {
        this.toast.pop('warning', '请选择加工类型!');
        return;
      }
      if (!this.addPro['weight']) {
        this.toast.pop('warning', '请输入单卷重!');
        return;
      }
    }
    if (Object.getOwnPropertyNames(this.addPro).length) {
      this.slitlist.push(this.addPro);
    }
    const linshiarray = [];
    this.slitlist.forEach(element => {
      // 长*宽*厚*加工方式*单卷重
      const cpguige = element['length'] + '*' + element['width'] + '*' + element['houdu']
        + '*' + element['jgtype'] + '*' + element['weight'];
      linshiarray.push(cpguige);
    });
    this.selectRowData['cpguige'] = linshiarray.join(';');
    this.hideaddProModal();
    this.gridOptions.api.refreshCells({ force: true });
  }
  /**删除加工成品规格 */
  delitem(index) {
    this.slitlist.splice(index, 1);
  }
  getcangku() {
    this.cangkus = [{ value: '', label: '全部' }];
    this.userapi.cangkulist().then(data => {
      data.forEach(element => {
        this.cangkus.push({
          value: element['id'],
          label: element['name']
        });
      });
    });
  }
}
