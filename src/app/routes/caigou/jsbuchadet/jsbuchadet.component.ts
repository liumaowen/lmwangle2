import { CaigouService } from './../caigou.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { JsbuchaimportComponent } from 'app/dnn/shared/jsbuchaimport/jsbuchaimport.component';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { QualityobjectionimportComponent } from 'app/dnn/shared/qualityobjectionimport/qualityobjectionimport.component';

const sweetalert = require('sweetalert');
@Component({
  selector: 'app-jsbuchadet',
  templateUrl: './jsbuchadet.component.html',
  styleUrls: ['./jsbuchadet.component.scss']
})
export class JsbuchadetComponent implements OnInit {
  @ViewChild('addModal') private addModal: ModalDirective;
  @ViewChild('zhiliagnyiyi') private zhiliagnyiyi: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  buchaModel: Object = {org: '', sorg: '', vuser: ''};
  isshow: boolean;
  ischahang: boolean;
  title: any;
  cs: any[];
  gns: any[];
  gnid: any;
  rstypes = [{ value: '1', label: '补重' }, { value: '2', label: '退款' }, { value: '3', label: '订货折让' }];
  // 引入弹窗对象
  bsModalRef: BsModalRef;
  //引入质量异议
  zlbsModalRef: BsModalRef;
  isimport = { flag: true };
  // 补差单详情
  gridOptions: GridOptions;
  det: object = {jine: '', beizhu: ''};
  flag: object = {tijiao: false, shenhe: false, qishen: false};
  jiesuanbucha;
  constructor(public settings: SettingsService, private route: ActivatedRoute, private toast: ToasterService,
    private modalService: BsModalService, private caigouApi: CaigouService, private router: Router, private classifyApi: ClassifyApiService) {
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
        getContextMenuItems: this.settings.getContextMenuItems
      };
      this.gridOptions.onGridReady = this.settings.onGridReady;
      // this.gridOptions.groupUseEntireRow = true;
      this.gridOptions.groupSuppressAutoColumn = true;
      // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: 'id', field: 'id', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 80 },
      { cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'center' }, headerName: '提单号', field: 'tihuobillno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品大类', field: 'gnname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 80,
        cellRenderer: (params) => {
          if (params.data.id && this.buchaModel['status'] === 0) {
            return '<a target="_blank">删除</a>';
          }else {
            return '';
          }
        }, onCellClicked: (params) => {
          if (params.data.id && this.buchaModel['status'] === 0) {
            sweetalert({
              title: '你确定要删除吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.caigouApi.jsbuchadeletedet(params.data.id).then(data => {
                this.toast.pop('success', '删除成功！');
                this.querydata();
              });
              sweetalert.close();
            });
          }
        }
      }
    ];
    this.querydata();
  }
  querydata() {
    this.caigouApi.getjsbuchadet(this.route.params['value']['id']).then(data => {
      this.buchaModel = data.jsbucha;
      if(Number(data.jsbucha.jine) < 0){
        this.title = '结算补差详情（退款）';
      }else if(Number(data.jsbucha.jine) > 0){
        this.title = '结算补差详情（收款）';
      }else{
        this.title = '结算补差详情';
      }

      if (data.jsbucha.status === 0) {
        this.flag['tijiao'] = true;
        this.flag['shenhe'] = false;
        this.flag['qishen'] = false;
      }else if (data.jsbucha.status === 1) {
        this.flag['tijiao'] = false;
        this.flag['shenhe'] = true;
        this.flag['qishen'] = false;
      }else if (data.jsbucha.status === 2) {
        this.flag['tijiao'] = false;
        this.flag['shenhe'] = false;
        this.flag['qishen'] = true;
      }
      if (data.jsbucha.type === 2 && data.jsbucha.status === 0) {
        this.isshow = true;
        this.ischahang = false;
      }else if ((data.jsbucha.type === 1 || data.jsbucha.type === 3) && data.jsbucha.status === 0) {
        this.isshow = false;
        this.ischahang = true;
      }else {
        this.isshow = false;
        this.ischahang = false;
      }
      this.gridOptions.api.setRowData(data.list);
      this.getrstypename();
    });
  }

  ngOnInit() {
  }
  importdet() {
    this.modalService.config.class = 'modal-all';
    this.bsModalRef = this.modalService.show(JsbuchaimportComponent);
    this.bsModalRef.content.parentthis = this;
  }
  openadddet() {
    this.gns = [];
    // this.classifyApi.getGnAndChandi().then(data => {
    //   data.forEach(element => {
    //     this.gns.push({
    //       label: element.name,
    //       value: element
    //     });
    //   });
    // });
    this.det = {jine: '', beizhu: '', gn: '', jsbuchaid: this.route.params['value']['id']};
    this.addModal.show();
  }
  deletebucha() {
    if (confirm('确认要删除吗？')) {
      this.caigouApi.deletebucha(this.route.params['value']['id']).then(data => {
        this.toast.pop('success', '删除成功！', '');
        this.router.navigate(['jsbucha']);
      });
    }
  }
  close() {
    this.addModal.hide();
  }
  add() {
    if (this.det['jine'] === '') {
      this.toast.pop('warning', '请填写金额！', '');
      return;
    }
    if(this.gnid === null){
      this.toast.pop('warning', '请选择品名！', '');
      return;
    }
    if (this.det['jine'] === '0') {
      this.toast.pop('warning', '金额不能为零！', '');
      return;
    }
    this.caigouApi.jsbuchaadddet(this.det).then(data => {
      this.close();
      this.querydata();
    });
  }
  submitjs() {
    if (confirm('确认要提交审核吗？')) {
      this.caigouApi.submitjs(this.route.params['value']['id']).then(data => {
        this.toast.pop('success', '提交成功！', '');
        this.querydata();
      });
    }
  }
  verifyjs() {
    if (confirm('确认要审核吗？')) {
      this.caigouApi.verifyjs(this.route.params['value']['id']).then(data => {
        this.toast.pop('success', '审核成功！', '');
        this.querydata();
      });
    }
  }
  back() {
    if (confirm('确认要回退吗？')) {
      this.caigouApi.backjs(this.route.params['value']['id']).then(data => {
        this.toast.pop('success', '回退成功！', '');
        this.querydata();
      });
    }
  }
  refuse() {
    if (confirm('确认要弃审吗？')) {
      this.caigouApi.refusejs(this.route.params['value']['id']).then(data => {
        this.toast.pop('success', '弃审成功！', '');
        this.querydata();
      });
    }
  }

  selectedgn(value) {
    this.gnid = value.id;
  }

  zhiliangModel(){
    this.zhiliagnyiyi.show();
  }
  hideModal(){
    this.zhiliagnyiyi.hide();
  }
  choice(){
    if (!this.buchaModel['rstype']) {
      this.toast.pop('error', '请填写处理类型！');
      return;
    }
    if (!this.buchaModel['rsbeizhu']) {
      this.toast.pop('error', '请填写处理说明！');
      return;
    }
    if (this.buchaModel['rsjine'] === null || this.buchaModel['rsjine'] === undefined || this.buchaModel['rsjine'] === '') {
      this.toast.pop('error', '请填写金额！');
      return;
    }
    this.addModal.hide();
    this.modalService.config.class = 'modal-all';
    this.zlbsModalRef = this.modalService.show(QualityobjectionimportComponent);
    this.zlbsModalRef.content.isimport = this.isimport;
    this.zlbsModalRef.content.buchaModel = this.buchaModel;
    this.zlbsModalRef.content.parent = this;
    this.hideModal();
  }
  rstypename;
  getrstypename() {
    let rstype = this.buchaModel['rstype'];
    if (rstype === null || rstype === undefined) {
      this.rstypename = '';
    } else if (rstype === 1) {
      this.rstypename = '补重';
    } else if (rstype === 2) {
      this.rstypename = '退款';
    } else if (rstype === 3) {
      this.rstypename = '订货折让';
    } 
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    this.det['gn'] = item.itemname;
  }
}
