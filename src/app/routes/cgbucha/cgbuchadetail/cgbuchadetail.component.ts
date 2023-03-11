import { RukucollectedetimportComponent } from './../../../dnn/shared/rukucollectedetimport/rukucollectedetimport.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { CgbuchaapiService } from './../cgbuchaapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { CgbuchaimportComponent } from './../../../dnn/shared/cgbuchaimport/cgbuchaimport.component';
import { DatePipe } from '@angular/common';
import { CgbuchafanliimportComponent } from 'app/dnn/shared/cgbuchafanliimport/cgbuchafanliimport.component';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-cgbuchadetail',
  templateUrl: './cgbuchadetail.component.html',
  styleUrls: ['./cgbuchadetail.component.scss']
})
export class CgbuchadetailComponent implements OnInit {

  @ViewChild('tuikuanModal') private tuikuanModal: ModalDirective;
  @ViewChild('jineModal') private jineModal: ModalDirective;
  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  modify: Object = { id: '', jine: '',fanliid: '' };
  // 采购补差详情
  caigouModel = { org: {}, buyer: {} };
  isshow: boolean;
  chengdui: boolean;
  lastyearfanli: boolean; // 去年返利
  PJbucha: boolean;
  isrukucollect: boolean;
  // 品名
  gns: any[];
  // 产地
  chandis: any[];
  // 厚度
  houdus: any[];
  // 宽度
  widths: any[];
  cs: any[];
  isChandi: boolean;
  det: Object = {
    id: '', gn: '', chandi: '', houduid: '', widthid: '', grno: '', jine: '', beizhu: '', type: '', rukudate: '', ndflorgid: '',
    isft: false
  };
  types: any[];
  isimport = true;
  submitShow = true;
  // 引入弹窗对象
  kcbsModalRef: BsModalRef;
  cgbsModalRef: BsModalRef;
  chengduititle: any;
  // 补差单详情
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private cgbuchaApi: CgbuchaapiService, private route: ActivatedRoute,
    private datepipe: DatePipe, private classifyApi: ClassifyApiService, private toast: ToasterService,
    private modalService: BsModalService, private router: Router) {
    this.gridOptions = {
      rowSelection: 'multiple',
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter:true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', cellRenderer: 'group',
        minWidth: 90, checkboxSelection: true, headerCheckboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'id', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '退款类型', field: 'type', minWidth: 90,
        cellRenderer: (params) => {
          if (params.data.type === 0) {
            return '返利';
          } else if (params.data.type === 1) {
            return '利息';
          } else if (params.data.type === 2) {
            return '索赔';
          } else if (params.data.type === 3) {
            return '费用';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', minWidth: 110 },
      // tslint:disable-next-line:max-line-length
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 75 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, valueFormatter: this.settings.valueFormatter3 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '原价', field: 'oldprice', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '现价', field: 'price', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '价差', field: 'jiacha', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 90,
        onCellClicked: (params) => {
          if (this.caigouModel['status']!==0) {
            this.toast.pop('warning', '只有制单中允许修改！');
            return;
          }
          if (params.data.newfanliid) {
            this.modify['fanliid'] = params.data.newfanliid;
            this.modify['jine'] = params.data.jine;
            this.modify['id'] = params.data.id;
            this.jineModal.show();
          } else if (params.data.fanliid) {
            this.modify['id'] = params.data.id;
            this.jineModal.show();
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '返利机构', field: 'ndflorgname', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '入库时间', field: 'rukudate', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', minWidth: 60, 
        cellRenderer: (params) => {
            return '<a target="_blank">删除</a>';
        },
        onCellClicked: (params) => {
            sweetalert({
                title: '你确定要删除吗?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#23b7e5',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: false
              }, () => {
                this.cgbuchaApi.removedet(params.data.id).then(data => {
                  this.querydata();
                });
                sweetalert.close();
              })
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcid', field: 'gcid', minWidth: 75 }
    ];
    this.querydata();
  }

  ngOnInit() {
    
  }
  jinelose() {
    this.jineModal.hide();
  }
  submitmodify() {
    if (!this.modify['jine']) {
      this.toast.pop('error', '请填写金额再提交！', '');
      return;
    } else {
      if (!/^((-)?[0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/.test(this.modify['jine'])) {
        this.toast.pop('error', '请正确填写金额！', '');
        return;
      }
    }
    if(this.modify['fanliid']) {
        this.cgbuchaApi.modifydetnew(this.modify['id'], this.modify).then(data => {
            this.toast.pop('success', '修改成功！', '');
            this.querydata();
            this.jineModal.hide();
        });
    } else {
        this.cgbuchaApi.modifydet(this.modify['id'], this.modify).then(data => {
            this.toast.pop('success', '修改成功！', '');
            this.querydata();
            this.jineModal.hide();
        }); 
    }
  }
  // 查询当前的详情
  querydata() {
    this.cgbuchaApi.cgbuchadetail(this.route.params['value']['id']).then(data => {
      console.log('data', data);
      if (data.cgbucha.type === 0) {
        this.isshow = true;
        this.chengdui = false;
        this.lastyearfanli = false;
      } else if (data.cgbucha.type === 1 || data.cgbucha.type === 6) {
        this.isshow = false;
        this.chengdui = false;
        this.lastyearfanli = false;
        this.isrukucollect = true;
      } else if (data.cgbucha.type === 2) {
        this.isshow = true;
        this.chengdui = true;
        this.lastyearfanli = false;
      } else if (data.cgbucha.type === 7) {
        this.isshow = true;
        this.chengdui = true;
        this.lastyearfanli = false;
      } else if (data.cgbucha.type === 3) {
        this.isshow = true;
        this.chengdui = false;
        this.lastyearfanli = true;
      } else if (data.cgbucha.type === 4) {
        this.isshow = true;
        this.chengdui = true;
        this.lastyearfanli = false;
      } else if (data.cgbucha.type === 5) {
        this.PJbucha = true;
      }
      if (data.cgbucha.status !== 0) this.submitShow = false;
      this.caigouModel = data.cgbucha;
      this.getStatus();
      this.gridOptions.api.setRowData(data.list);
      if (this.caigouModel['type'] === 7) {
        this.chengduititle = '添加超支借款利息明细';
      } else {
        this.chengduititle = '添加承兑贴息明细';
      }
    });
  }
  // 引入入库汇总
  importdet() {
    this.modalService.config.class = 'modal-all';
    this.kcbsModalRef = this.modalService.show(RukucollectedetimportComponent);
    // this.kcbsModalRef.content.isimport = this.isimport;
    this.kcbsModalRef.content.parentthis = this;
  }
  // 添加采购退款明细
  openadddet() {
    this.types = [{ id: '0', text: '返利' }, { id: '1', text: '利息' }, { id: '2', text: '索赔' }, { id: '3', text: '费用' }];
    this.isChandi = false;
    this.det = {
      id: this.route.params['value']['id'], gn: '', chandi: '', houduid: '', widthid: '',
      grno: '', jine: '', beizhu: '', type: '', rukudate: '', ndflorgid: '', isft: false
    };
    this.gns = [];
    this.classifyApi.getGnAndChandi().then(data => {
      data.forEach(element => {
        this.gns.push({
          label: element.name,
          value: element
        });
      });
      console.log('gns11', this.gns);
    });
    this.tuikuanModal.show();
  }
  selectetype(value) {
    this.det['type'] = value.id;
  }
  adddet() {
    console.log(this.det);
    if (this.det['type'] === '' && !this.chengdui && !this.lastyearfanli && !this.PJbucha) {
      this.toast.pop('warning', '请选择退款类型！', '');
      return;
    }
    if (!this.det['gn']) {
      this.toast.pop('warning', '请选择品名！', '');
      return;
    }
    if (!this.det['chandi']) {
      this.toast.pop('warning', '请选择产地！', '');
      return;
    }
    if (this.det['jine'] === '') {
      this.toast.pop('warning', '请填写金额！', '');
      return;
    }
    console.log(this.det['rukudate']);
    if (this.det['rukudate'] === '' && this.lastyearfanli) {
      this.toast.pop('warning', '请选择入库时间！', '');
      return;
    }
    if (this.det['ndflorgid'] === '' && this.lastyearfanli) {
      this.toast.pop('warning', '请选择机构！', '');
      return;
    }
    this.det['rukudate'] = this.datepipe.transform(this.det['rukudate'], 'yyyy-MM-dd');
    this.cgbuchaApi.adddet(this.det).then(data => {
      this.closetuikuan();
      this.querydata();
    });
  }
  // 关闭退款对话框
  closetuikuan() {
    this.tuikuanModal.hide();
  }
  selectedgn(value) {
    console.log('0002', value);
    this.cs = [];
    this.chandis = [];
    this.det['gnid'] = value.id;
    this.det['chandiid'] = '';
    this.cs = value.attrs;
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.isChandi = true;
    // console.log('chandis', this.chandis);
  }
  selectedchandi(value) {
    // console.log('guige', value);
    this.classifyApi.getAttrs(value).then(data => {
      data.forEach(element => {
        if (element.name === 'houduid') {
          this.houdus = element.options;
        } else if (element.name === 'widthid') {
          this.widths = element.options;
        }
      });
      // console.log('guige', data);
    });
  }
  deletebucha() {
    if (confirm('确认要删除补差单吗？')) {
      this.cgbuchaApi.removeById(this.caigouModel['id']).then(data => {
        this.router.navigate(['cgbucha']);
      });
    }
  }
  importfanli() {
    if (this.caigouModel['ispingzheng']) {
      this.toast.pop('error', '已生成凭证不允许添加返利！', '');
      return;
    }
    this.modalService.config.class = 'modal-all';
    this.cgbsModalRef = this.modalService.show(CgbuchaimportComponent);
    this.cgbsModalRef.content.parentthis = this;
  }
  importfanli2() {
    if (this.caigouModel['ispingzheng']) {
      this.toast.pop('error', '已生成凭证不允许添加返利！', '');
      return;
    }
    this.modalService.config.class = 'modal-all';
    this.cgbsModalRef = this.modalService.show(CgbuchafanliimportComponent);
    this.cgbsModalRef.content.parentthis = this;
  }
  /**上传 */
  uploaddet() {
    this.uploaderModel.show();
  }
  hideDialog() {
    this.uploaderModel.hide();
  }
  // 入库单上传信息及格式
  uploadParam: any = { module: 'uploadCgbuchaDet', count: 1, sizemax: 1, extensions: ['xls'] };

  // 设置上传的格式
  accept = ".xls, application/xls";

  // 上传成功执行的回调方法
  uploads($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.cgbuchaApi.uploaddet({ fileUrls: addData, cgbuchaid: this.caigouModel['id'] }).then(data => {
        this.querydata();
        this.hideDialog();
        this.toast.pop('success', '上传成功！');
      });
    }

  }
  //提交审核
  submit() {
    if (confirm('确认要提交审核吗？')) {
      this.cgbuchaApi.submitverify(this.route.params['value']['id']).then(data => {
        this.toast.pop('success', '提交成功！', '');
        this.querydata();
      });
    }
  }
  status = '';
  getStatus() {
    let status = this.caigouModel['status'];
    if (status === 0) {
      this.status = '制单中';
    } else if (status === 1) {
      this.status = '审核中';
    } else if (status === 2) {
      this.status = '已审核';
    }
  }
  //批量删除明细
  buchadetids: any = [];
  deletebuchaDet() {
    this.buchadetids = new Array();
    const buchadetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < buchadetlist.length; i++) {
      if (buchadetlist[i].selected && buchadetlist[i].data && !buchadetlist[i].data['group']) {
        this.buchadetids.push(buchadetlist[i].data.id);
      }
    }
    if (!this.buchadetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.cgbuchaApi.deletecgbuchaDet(this.buchadetids).then(data => {
        this.toast.pop('success', '删除成功！');
        this.querydata();
      });
    }
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
        break;
      }
    }
    this.det['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.det['chandi'] = this.chandioptions[0]['value'];
    }
  }
}
