import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ColDef, GridOptions } from 'ag-grid/main';
import { YunfeeapiService } from './../yunfeeapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { DatePipe } from '@angular/common';
import { UserapiService } from './../../../dnn/service/userapi.service';

const sweetalert = require('sweetalert');
@Component({
  selector: 'app-yunfee',
  templateUrl: './yunfee.component.html',
  styleUrls: ['./yunfee.component.scss']
})
export class YunfeeComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('parentModal') private parentModal: ModalDirective;
  @ViewChild('addModal') private addModal: ModalDirective;
  @ViewChild('validdateModal') private validdateModal: ModalDirective;

  // 构造传入参数 //调用上传功能的模块名称//文件最大尺寸//支持的文件扩展名
  uploadParam = { module: 'yunfee', count: 1, sizemax: 1, extensions: ['xls'] };

  // 设置上传文件类型
  accept = '.xls, application/xls';

  // 运费对象
  yunfeeModel = { yuntype: ''};

  gridOptions: GridOptions;

  departures = new Array();
  provinces = [];
  citys = [];
  countys = [];
  provinces1 = [];
  citys1 = [];
  countys1 = [];
  yunfee: any = {};
  transporttype = [{ label: '请选择。。。', value: null }, { label: '汽运', value: 1 }, { label: '铁运', value: 2 }, { label: '船运', value: 3 }];
  sectionlist: any = []; // 载重区间列表
  minweights: any = []; // 载重区间最小值
  maxweights: any = []; // 载重区间最大值
  ismodify = false;
  issaleman = false;
  effectivestarttime = new Date();
  effectiveendtime: Date;
  maxDate = new Date();
  validdateobj: any = {};
  ckitems = [];
  constructor(public settings: SettingsService,
    private toast: ToasterService,
    private yunfeeApi: YunfeeapiService,
    private addressparseService: AddressparseService,
    private classifyapi: ClassifyApiService,
    private datePipe: DatePipe,
    private userapi: UserapiService,) {

    this.gridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
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
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 56, checkboxSelection: true,colId: 'check' },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'status', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startarea', minWidth: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地仓库', field: 'startcangkuname', minWidth: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 省', field: 'endprovincename', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 市', field: 'endcityname', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 县', field: 'endcountyname', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地仓库', field: 'endcangkuname', minWidth: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '载重区间', field: 'weightrange', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输类型', field: 'yuntype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '竞价方式', field: 'ist', minWidth: 80 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '系统价格', field: 'price', minWidth: 80 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '实付价格', field: 'innerprice', minWidth: 80,
       colId: 'innerprice' ,valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价时间', field: 'baojiadate', minWidth: 125 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运费单位', field: 'wlcustomername', minWidth: 140,
      colId: 'wlcustomername' },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效开始时间', field: 'effectivestarttime', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效结束时间', field: 'effectiveendtime', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', minWidth: 80 },
    ];
    this.getMyRole();
  }

  ngOnInit() {
    if (!this.ckitems.length) {
      this.ckitems = [{ value: '', label: '全部' }];
      this.userapi.cangkulist().then(data => {
        data.forEach(element => {
          this.ckitems.push({
            value: element['id'],
            label: element['name']
          });
        });
      });
    }
    this.listDetail();
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
    this.getweightrange();
  }

  // 网格赋值
  listDetail() {
    this.yunfeeApi.getList(this.yunfeeModel).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }
// 获取用户角色，如果登陆的用户是业务员，设置为不可见
getMyRole() {
  const myrole = JSON.parse(localStorage.getItem('myrole'));
  if (myrole.some(item => item === 10)) {
    this.gridOptions.columnDefs.forEach((colde: ColDef) => {
      if (colde.colId === 'innerprice' || colde.colId === 'wlcustomername' || colde.colId==='check') {
        colde.hide = true;
        colde.suppressToolPanel = true;
      }
      if (colde.colId==='check') {
        colde.hide = true;
        colde.checkboxSelection = false;
        colde.suppressToolPanel = true;
      }
    });
    this.issaleman = true;
  } else {
    this.issaleman = false;
  }
}
  // 全部选中
  checkAll() {
    this.gridOptions.api.selectAll();
  }

  // 取消选择
  uncheckAll() {
    this.gridOptions.api.deselectAll();
  }

  // 删除选中的运费
  deletechecked() {
    const sectionids = [];
    const yunfeeSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < yunfeeSelected.length; i++) {
      if (yunfeeSelected[i].data && yunfeeSelected[i].selected) {
        sectionids.push(yunfeeSelected[i].data.id);
      }
    }
    if (sectionids.length < 1) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    sweetalert({
      title: '你确定要删除吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.yunfeeApi.deleteselected({ sectionids: sectionids }).then(() => {
        this.toast.pop('success', '删除操作成功');
        this.listDetail();
      });
      sweetalert.close();
    });
  }


  // 弹出查询对话框
  query() {
    this.getweightrange();
    this.getProvince();
    this.classifyapi.getarea().then((resource) => {
      const departurelist = [{ label: '请选择出发地', value: '' }];
      resource.cangku.forEach(element => {
        departurelist.push({
          label: element.name,
          value: element.id
        });
      });
      this.departures = departurelist;
    });
    this.selelctNull();
    this.showclassicModal();
  }

  selelctNull() {
    this.yunfeeModel = { yuntype: '' };
  }

  // 运费添加
  queryfee() {
    this.listDetail();
    this.hideclassicModal();
  }

  // 导入按钮
  importDialog() {
    this.showparentModal();
  }

  // 上传文件
  uploads($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.yunfeeApi.import(addData).then(data => {
        // this.singleData.unshift(data);
        this.listDetail();
        this.toast.pop('success', '上传成功！');
      });
    }
    this.listDetail();
    this.hideparentModal();
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  showparentModal() {
    this.parentModal.show();
  }

  hideparentModal() {
    this.parentModal.hide();
  }
  /**创建 */
  showaddmodal() {
    this.addModal.show();
    this.getweightrange();
    this.getProvince();
    this.yunfee = {};
    this.sectionlist = [{ist: false, yuntype: ''}];
    this.ismodify = false;
  }
  hideaddModal() {
    this.addModal.hide();
  }
  /**创建保存 */
  add() {
    if (this.provinces.length) {
      if (!this.yunfee['startprovinceid']) {
        this.toast.pop('warning', '请把起始地省填写完成!');
        return;
      }
    }
    if (this.citys.length) {
      if (!this.yunfee['startcityid']) {
        this.toast.pop('warning', '请把起始地市填写完成!');
        return;
      }
    }
    if (this.countys.length) {
      if (!this.yunfee['startcountyid']) {
        this.toast.pop('warning', '请把起始地县填写完成!');
        return;
      }
    }
    if (this.provinces1.length) {
      if (!this.yunfee['endprovinceid']) {
        this.toast.pop('warning', '请把目的地省填写完成!');
        return;
      }
    }
    if (this.citys1.length) {
      if (!this.yunfee['endcityid']) {
        this.toast.pop('warning', '请把目的地市填写完成!');
        return;
      }
    }
    if (this.countys1.length) {
      if (!this.yunfee['endcountyid']) {
        this.toast.pop('warning', '请把目的地县填写完成!');
        return;
      }
    }
    if (!this.sectionlist.length) {
      this.toast.pop('warning', '请把载重区间填写完成!');
      return;
    }
    const isall = this.sectionlist.some(section => !section['minweight'] || !section['maxweight'] || !section['yuntype']);
    if (isall) {
      this.toast.pop('warning', '请把载重区间填写完成!');
      return;
    }
    for (let index = 0; index < this.sectionlist.length; index++) {
      const element = this.sectionlist[index];
      const min = Number(element['minweight']);
      const max = Number(element['maxweight']);
      if (max < min) {
        this.toast.pop('warning', `第${index + 1}条区间最大值不能小于最小值！！！`);
        return;
      }
    }
    this.yunfee['sectionlist'] = this.sectionlist;
    sweetalert({
      title: '你确定要创建吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.yunfeeApi.create(this.yunfee).then(data => {
        this.hideaddModal();
        this.listDetail();
        this.toast.pop('success', '创建成功！');
      });
      sweetalert.close();
    });
  }
  /**
   * 起始地根据详细地址自动识别省市县
   */
  selectedenddest(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys = []; this.countys = [];
      this.yunfee['startprovinceid'] = '';
      this.yunfee['startcityid'] = '';
      this.yunfee['startcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.yunfee['startprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.yunfee['startprovinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.yunfee['startcityid'] = addressObj['cityValue'];
                this.getpcc(this.yunfee['startcityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.yunfee['startcountyid'] = addressObj['countyValue'];
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
      this.yunfee['endprovinceid'] = '';
      this.yunfee['endcityid'] = '';
      this.yunfee['endcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces1.length) {
          this.yunfee['endprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.yunfee['endprovinceid'], this.citys1).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.yunfee['endcityid'] = addressObj['cityValue'];
                this.getpcc(this.yunfee['endcityid'], this.countys1).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.yunfee['endcountyid'] = addressObj['countyValue'];
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
  /**
   * 获取载重区间值
   */
  getweightrange() {
    this.minweights = [{ label: '请选择', value: null }];
    this.classifyapi.listclassify('yunfee_weightrange').then(data => {
      data.forEach(e => {
        this.minweights.push({label: e['name'], value: e['name']});
      });
      this.maxweights = this.minweights;
    });
  }
  deletesection(i) {
    this.sectionlist.splice(i, 1);
  }
  addqujian() {
    this.sectionlist.push({ist: false, yuntype: ''});
  }
  /**打开修改弹窗 */
  showupdate() {
    const yunfeeids = [];
    const yunfeeSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < yunfeeSelected.length; i++) {
      if (yunfeeSelected[i].data && yunfeeSelected[i].selected) {
        yunfeeids.push(yunfeeSelected[i].data.yunfeeid);
      }
    }
    if (yunfeeids.length < 1) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    if (yunfeeids.length > 1) {
      this.toast.pop('warning', '只能选择一条明细！！！');
      return;
    }
    this.addModal.show();
    this.getProvince();
    this.yunfee = {ist: false};
    this.yunfeeApi.getone(yunfeeids[0]).then(data => {
      const startarea = data['bill']['startprovincename'] + data['bill']['startcityname'] + data['bill']['startcountyname'];
      const endarea = data['bill']['endprovincename'] + data['bill']['endcityname'] + data['bill']['endcountyname'];
      this.yunfee['startarea'] = startarea;
      this.yunfee['endarea'] = endarea;
      this.yunfee['id'] = data['bill']['id'];
      this.sectionlist = data['list'];
      this.ismodify = true;
    });
  }
  /**后台删除区间 */
  del(id, i) {
    sweetalert({
      title: '你确定要删除吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.yunfeeApi.delsection(id).then(data => {
        this.toast.pop('success', '删除成功！');
        this.sectionlist.splice(i, 1);
        if (data['isalldel']) {
          this.hideaddModal();
          this.listDetail();
        }
        sweetalert.close();
      });
    });
  }
  /**修改载重区间 */
  update(id) {
    const isall = this.sectionlist.some(section => !section['minweight'] || !section['maxweight'] || !section['yuntype']);
    if (isall) {
      this.toast.pop('warning', '请把载重区间填写完成!');
      return;
    }
    for (let index = 0; index < this.sectionlist.length; index++) {
      const element = this.sectionlist[index];
      const min = Number(element['minweight']);
      const max = Number(element['maxweight']);
      if (max < min) {
        this.toast.pop('warning', `第${index + 1}条区间最大值不能小于最小值！！！`);
        return;
      }
    }
    const params = {sectionlist: this.sectionlist, yunfeeid: id};
    this.yunfeeApi.modify(id, params).then(data => {
      this.toast.pop('success', '修改成功！');
      this.listDetail();
      this.hideaddModal();
    });
  }
  /**打开批量修改有效时间 */
  showeffective() {
    this.effectivestarttime = new Date();
    this.effectiveendtime = undefined;
    const sectionids = [];
    this.validdateobj = {};
    const yunfeeSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < yunfeeSelected.length; i++) {
      if (yunfeeSelected[i].data && yunfeeSelected[i].selected) {
        sectionids.push(yunfeeSelected[i].data.id);
      }
    }
    if (sectionids.length < 1) {
      this.toast.pop('warning', '请选择固定路线明细！！！');
      return;
    }
    if (sectionids.length > 1) {
      this.toast.pop('warning', '请选择一条固定路线明细！！！');
      return;
    }
    this.validdateobj['sectionids'] = sectionids;
    this.validdateModal.show();

  }
  hidevaliddateModal() {
    this.validdateModal.hide();
  }
  savevaliddate() {
    if (!this.effectivestarttime) {
      this.toast.pop('warning', '请选择有效开始时间！！！');
      return;
    }
    if (!this.effectiveendtime) {
      this.toast.pop('warning', '请选择有效结束时间！！！');
      return;
    }
    this.validdateobj.effectivestarttime = this.datePipe.transform(this.effectivestarttime, 'yyyy-MM-dd');
    this.validdateobj.effectiveendtime = this.datePipe.transform(this.effectiveendtime, 'yyyy-MM-dd');
    this.yunfeeApi.modifybatchvaliddate(this.validdateobj).then(data => {
      this.toast.pop('success', '修改成功！');
      this.listDetail();
      this.hidevaliddateModal();
    });
  }
}
