import { XsbuchaimportComponent } from './../../../dnn/shared/xsbuchaimport/xsbuchaimport.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from './../../../dnn/service/storage.service';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { XsbuchaapiService } from './../xsbuchaapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessorderapiService } from './../../businessorder/businessorderapi.service';
import { DatePipe } from '@angular/common';
import { QualityobjectionimportComponent } from 'app/dnn/shared/qualityobjectionimport/qualityobjectionimport.component';

@Component({
  selector: 'app-xsbuchadetail',
  templateUrl: './xsbuchadetail.component.html',
  styleUrls: ['./xsbuchadetail.component.scss']
})
export class XsbuchadetailComponent implements OnInit {
  @ViewChild('arrearspayDialog') private arrearspayDialog: ModalDirective;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('addTypeModal') private addTypeModal: ModalDirective;
  priceForm: FormGroup;
  isimport = { flag: true };
  detlist = [];
  showflag: {} = {}; 
  sprice: {} = {};
  xsbucha: any = {};
  yedate = new Date(); // 设定页面开始时间默认值
  minDate = new Date();
  overdraft = {};
  status = '';
  compensation: Boolean = null;

  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');

  gridOptions: GridOptions;

  // 引入弹窗模型
  bsModalRef: BsModalRef;
   //引入质量异议
   zlbsModalRef: BsModalRef;

  constructor(public settings: SettingsService, private fb: FormBuilder, private xsbuchaApi: XsbuchaapiService,
    private storage: StorageService, private route: ActivatedRoute, private router: Router, private toast: ToasterService,
    private modalService: BsModalService, private businessOrderApi: BusinessorderapiService, private datepipe: DatePipe) {

    this.priceForm = fb.group({
      'tprice': [null, Validators.compose([Validators.required, Validators.pattern('^(-?[0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$')])]
    });

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
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;

    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      //          {cellStyle: {"text-align": "center"}, headerName: '选择',width: 56, checkboxSelection:true},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', cellRenderer: 'group', width: 90, checkboxSelection: true,headerCheckboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '补差单位', field: 'buyername', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 260 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '补差单价', field: 'perprice', width: 90,
        valueGetter: (params) => {
          return Math.round(params.data['perprice'] * 100) / 100;
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '<font color="red">金额</font>', field: 'jine', width: 90,
        valueGetter: (params) => {
          return Math.round(params.data['jine'] * 100) / 100;
        }, valueFormatter: this.settings.valueFormatter2,
        onCellClicked: (params) => {
          console.log('pa', params);
          if (this.xsbucha['cuserid'] === this.current.id) {
            if (this.xsbucha['status'] === 0) {
              if (!params.data.isback) {// 补差数据可填写
                this.sprice = {};
                this.showDialog();
                // 防止订阅事件重复叠加
                let cishu = 0;
                this.classicModal.onHidden.subscribe(data => {
                  if (cishu === 0) {
                    if (!isNaN(this.sprice['tprice'])) {
                      this.sprice['xsbuchadetid'] = params.data.id;
                      console.log('papp', this.sprice);
                      this.xsbuchaApi.price(this.sprice).then(() => {
                        this.listDetail();
                        this.toast.pop('success', '补差金额填写成功');
                        cishu++;
                      });
                    }
                  }
                });

              }
            }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'cangkuname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'realname', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 90,
        cellRenderer: function (params) {
          return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细id', field: 'id', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', width: 100,
        cellRenderer: (params) => {
          if (this.xsbucha['cuserid'] === this.current['id']) {
            if (!this.xsbucha['isv'] && this.xsbucha['status'] === 0) {
              return '<a ng-hide="xsbucha.isv" target="_blank">删除</a>';
            } else {
              return '';
            }
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (this.xsbucha['cuserid'] === this.current.id) {
            if (!this.xsbucha['isv'] && this.xsbucha['status'] === 0) {
              if (confirm('你确定删除这个补差明细吗？')) {
                this.xsbuchaApi.removeone(params.data.id).then(() => {
                  this.toast.pop('success', '删除成功');
                  // Notify.alert('删除成功', { status: 'success' });
                  this.listDetail();
                });
              }
            }
          }
        }
      }];
    this.listDetail();
  }

  ngOnInit() {
    this.getCategory();
  }

  listDetail() {
    this.xsbuchaApi.getxsbucha(this.route.params['value']['id']).then((response) => {
      this.xsbucha = response['xsbucha'];
      console.log(this.xsbucha);
      if (this.xsbucha['status'] === 0) {
        this.status = '制单中';
        this.showflag['import'] = true;
      } else {
        this.showflag['import'] = false;
      }
      if(this.xsbucha['status'] === 1){
          this.status = '待审核';
      }
      if (this.xsbucha['status'] === 1 && this.xsbucha['vuserid'] === this.current.id) {
        this.showflag['verify'] = true;
      } else {
        this.showflag['verify'] = false;
      }
      if (this.xsbucha['status'] === 2 && this.xsbucha['vuserid'] === this.current.id) {
        this.showflag['qishen'] = true;
      } else {
        this.showflag['qishen'] = false;
      }
      if (this.xsbucha['status'] === 2) {
        this.status = '已审核';
        this.showflag['pay'] = true;
      } else {
        this.showflag['pay'] = false;
      }
      console.log('xsbucha', response['list']);
      this.detlist = response['list'];
      this.gridOptions.api.setRowData(response['list']);
      this.getCategory();
    });
    
  }

  verify(id) {
    this.xsbuchaApi.verify(id).then(() => {
      this.toast.pop('success', '审核成功');
      this.router.navigateByUrl('xsbucha');
    });
  }

  refuseverify(id) {
    this.xsbuchaApi.refuseverify(id).then(() => {
      this.toast.pop('success', '拒审成功');
      this.router.navigateByUrl('xsbucha');
    });
  }

  submit(id) {
    if(!this.xsbucha.category){
      this.toast.pop('warning', '请先选择类型再提交审核！！！');
      return '';
    }
    if (this.detlist.length < 1) {
      this.toast.pop('warning', '请先引入明细再提交审核！！！');
      return '';
    }
    if(this.xsbucha['compensation'] === 0){
      if (confirm('该质量异议钢厂尚未赔付，属于先行赔付，需审批到总经理，是否确认提交')){
        if (this.xsbucha['tjine'] > 0) {
          this.businessOrderApi.getmoney1({ buyerid: this.xsbucha.buyerid, wcustomerid: this.xsbucha.sellerid,salemanid: this.xsbucha['salemanid'] }).then((data) => {
            let msg = {};
            if (!data['wyue']) {
              msg['currentmoney'] = 0;
            } else {
              msg['currentmoney'] = data['wyue'];
            }
            msg['paymoney'] = this.xsbucha.tjine;
            if (msg['currentmoney'].sub(msg['paymoney']) < 0) {
              // if (msg['currentmoney'].sub(0) < 0) {
              if (data['oyue'].sub(0) < 0) {
                this.overdraft['tjine'] = this.xsbucha.tjine;
              } else {
                this.overdraft['tjine'] = (msg['currentmoney'].sub(msg['paymoney'])).mul('-1');
              }
              this.arrearspayshow();
            } else {
              if (confirm('提醒：欠款客户补差单需要财务审核，普通补差单需负责人审核！')) {
                this.xsbuchaApi.submit(id).then(() => {
                  this.toast.pop('success', '提交成功');
                  this.router.navigateByUrl('xsbucha');
                });
              }
            }
          });
        } else {
          if (confirm('提醒：欠款客户补差单需要财务审核，普通补差单需负责人审核！')) {
            this.xsbuchaApi.submit(id).then(() => {
              this.toast.pop('success', '提交成功');
              this.router.navigateByUrl('xsbucha');
            });
          }
        }
      }
    }else{
      if (this.xsbucha['tjine'] > 0) {
        this.businessOrderApi.getmoney1({ buyerid: this.xsbucha.buyerid, wcustomerid: this.xsbucha.sellerid,salemanid: this.xsbucha['salemanid'] }).then((data) => {
          let msg = {};
          if (!data['wyue']) {
            msg['currentmoney'] = 0;
          } else {
            msg['currentmoney'] = data['wyue'];
          }
          msg['paymoney'] = this.xsbucha.tjine;
          if (msg['currentmoney'].sub(msg['paymoney']) < 0) {
            // if (msg['currentmoney'].sub(0) < 0) {
            if (data['oyue'].sub(0) < 0) {
              this.overdraft['tjine'] = this.xsbucha.tjine;
            } else {
              this.overdraft['tjine'] = (msg['currentmoney'].sub(msg['paymoney'])).mul('-1');
            }
            this.arrearspayshow();
          } else {
            if (confirm('提醒：欠款客户补差单需要财务审核，普通补差单需负责人审核！')) {
              this.xsbuchaApi.submit(id).then(() => {
                this.toast.pop('success', '提交成功');
                this.router.navigateByUrl('xsbucha');
              });
            }
          }
        });
      } else {
        if (confirm('提醒：欠款客户补差单需要财务审核，普通补差单需负责人审核！')) {
          this.xsbuchaApi.submit(id).then(() => {
            this.toast.pop('success', '提交成功');
            this.router.navigateByUrl('xsbucha');
          });
        }
      }
    }
  }
  // 提交欠款发货申请
  submitapply() {
    // console.log(this.overdraft);
    this.overdraft['billid'] = this.xsbucha['id'];
    this.overdraft['yedate'] = this.datepipe.transform(this.yedate, 'y-MM-dd');
    if (!this.overdraft['goodsmsg']) {
      this.toast.pop('warning', '请填写货物名称！');
      return;
    }
    if (!this.overdraft['days']) {
      this.toast.pop('warning', '请填写天数！');
      return;
    }
    if (!this.overdraft['reason']) {
      this.toast.pop('warning', '请填写原因！');
      return;
    }
    this.overdraft['type'] = 3;
    this.businessOrderApi.createoverdraft(this.overdraft).then(() => {
      this.arrearspayhide();
      this.listDetail();
      this.toast.pop('success', '提交成功');
    });
  }
  arrearspayshow() {
    this.arrearspayDialog.show();
  }
  arrearspayhide() {
    this.arrearspayDialog.hide();
  }

  // 打开引入对话框
  importDialog() {
    // if (this.xsbucha['cuserid'] != this.current.id) {
    //   this.toast.pop('warning', '你不是补差单的创建人，不能引入补差明细');
    //   return '';
    // }
    this.modalService.config.class = 'modal-all';
    this.bsModalRef = this.modalService.show(XsbuchaimportComponent);
    this.bsModalRef.content.parentThis = this;
    // imDialog = ngDialog.open({
    //   template: 'views/xsbucha/xsbuchaing_list.html',
    //   scope: $scope,
    //   className: 'ngdialog-theme-default ngdialog-width-100',
    //   closeByDocument: false,
    //   closeByEscape: false,
    //   showClose: true
    // });
  }

  xsbuchaimport() {
    this.bsModalRef.hide();
    this.listDetail();
  }

  remove(id) {
    if (confirm('你确定删除这个补差单吗？')) {
      this.xsbuchaApi.removeById(id).then(() => {
        this.toast.pop('success', '删除成功');
        this.router.navigateByUrl('xsbucha');
      });
    }
  }

  showDialog() {
    this.classicModal.show();
  }

  hideDialog() {
    this.classicModal.hide();
  }
  qishen(id) {
    if (confirm('你确定弃审这个补差单吗？')) {
      this.xsbuchaApi.qishen(id).then(data => {
        this.toast.pop('success', '弃审成功');
        this.listDetail();
      });
    }
  }
  /**修改 */
  modify() {
    this.xsbuchaApi.update(this.xsbucha).then(data => {
      this.listDetail();
    });
  }

  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  /**上传仓储号 */
  uploaddet() {
    this.uploaderModel.show();
  }

  // 入库单上传信息及格式
  uploadParam: any = { module: 'xsbucha', count: 1, sizemax: 1, extensions: ['xls'] };

  // 设置上传的格式
  accept = ".xls, application/xls";

  // 上传成功执行的回调方法
  uploads($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.xsbuchaApi.uploaddet({fileUrls: addData, id: this.xsbucha['id']}).then(data => {
        this.listDetail();
        this.toast.pop('success', '上传成功！');
      });
    }
    this.listDetail();
    this.uploaderModel.hide();
  }
  //批量删除明细
  xsbuchadetids: any = [];
  removeDet(){
    this.xsbuchadetids = new Array();
    const xsbuchadetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < xsbuchadetlist.length; i++) {
      if (xsbuchadetlist[i].selected && xsbuchadetlist[i].data) {
        this.xsbuchadetids.push(xsbuchadetlist[i].data.id);
      }
    }
    if (!this.xsbuchadetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.xsbuchaApi.deletexsbuchadet(this.xsbuchadetids).then(data => {
        this.toast.pop('success', '删除成功！');
        this.listDetail();
      });
    }
  }
  hideaddModal(){
    this.addTypeModal.hide(); 
  }
  typeShow(){
    this.addTypeModal.show();
  }
  addtype = [
    { label: '请选择类型', value: '' },
    { label: '运杂费调整', value: 1 },
    { label: '小数点平账', value: 2 },
    { label: '承兑贴息', value: 3 },
    { label: '处理质量异议', value: 4 },
    { label: '延期利息', value: 5 }
  ];
  category = '';
  getCategory() {
    console.log(this.category);
    let category = this.xsbucha['category'];
    if (category === null || category === undefined) {
      this.category = '';
    } else if (category === 1) {
      this.category = '运杂费调整';
    } else if (category === 2) {
      this.category = '小数点平账';
    } else if (category === 3) {
      this.category = '承兑贴息';
    } else if (category === 4) {
      this.category = '处理质量异议';
    }else if (category === 5) {
      this.category = '延期利息';
    }
    console.log(this.category);
  }
  choice(){
    // if(!this.xsbucha['compensation'] || this.xsbucha['compensation'] === null){
    //   this.toast.pop('warning', '请选择赔付类型！');
    //   return;
    // }
    if (!this.xsbucha.saletype) {
      this.toast.pop('error', '请填写处理类型！');
      return;
    }
    if (!this.xsbucha.salebeizhu) {
      this.toast.pop('error', '请填写处理说明！');
      return;
    }
    if(this.xsbucha['salejine']===null){
      this.toast.pop('warning', '请填写金额！');
      return;
    }
    this.hideaddModal();
    this.modalService.config.class = 'modal-all';
    this.zlbsModalRef = this.modalService.show(QualityobjectionimportComponent);
    this.zlbsModalRef.content.isimport = this.isimport;
    this.zlbsModalRef.content.xsbucha = this.xsbucha;
    this.zlbsModalRef.content.parent = this;
  }
  addreason() {
    this.xsbuchaApi.update(this.xsbucha).then(data => {
      if (data) {
        this.listDetail();
        this.hideaddModal();
      }
    });
  }
  saletypes = [{ value: '1', label: '补差' }, { value: '2', label: '退货' }, { value: '3', label: '订货折让' }];
}
