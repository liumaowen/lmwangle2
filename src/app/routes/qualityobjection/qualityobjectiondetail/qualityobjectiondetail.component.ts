import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QihuoService } from '../../qihuo/qihuo.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { QualityobjectionService } from '../qualityobjection.service';
import { TihuodetimportComponent } from './tihuodetimport/tihuodetimport.component';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { StorageService } from 'app/dnn/service/storage.service';
import { KucunqualityimportComponent } from './../../../dnn/shared/kucunqualityimport/kucunqualityimport.component';

const sweetalert = require('sweetalert');
@Component({
  selector: 'app-qualityobjectiondetail',
  templateUrl: './qualityobjectiondetail.component.html',
  styleUrls: ['./qualityobjectiondetail.component.scss'],
  providers: [QihuoService]
})
export class QualityobjectiondetailComponent implements OnInit {
  @ViewChild('supplierModal') supplierModal: ModalDirective;
  @ViewChild('gangchangrecordModal') gangchangrecordModal: ModalDirective;
  @ViewChild('resourceCenterModal') private resourceCenterModal: ModalDirective;
  @ViewChild('gangchangModal') private gangchangModal: ModalDirective;
  @ViewChild('saleModal') private saleModal: ModalDirective;
  @ViewChild('picdialog') private picdialog: ModalDirective;
  @ViewChild('fujianModal') private fujianModal: ModalDirective;
  @ViewChild('salefeedbackModal') private salefeedbackModal: ModalDirective;
  @ViewChild('wuliuchuliModel') private wuliuchuliModel: ModalDirective;
  @ViewChild('cangkuchuliModel') private cangkuchuliModel: ModalDirective;
  @ViewChild('cancelModel') private cancelModel: ModalDirective;
  @ViewChild('billnoModel') private billnoModel: ModalDirective;
  @ViewChild('billnoModel2') private billnoModel2: ModalDirective;

  gridOptions: GridOptions;
  gangchangrecord = { beizhu: '', isurl: false, url: '', id: '', type: 1 };
  qualityobjection: any = { seller: '' };
  types = [];
  // 引入弹窗模型
  bsModalRef: BsModalRef;
  flag = { isedit: false, isreportgc: false, isResourceCenter: false, issale: false };
  supplier: Object = { supplierid: ''};
  // 附件上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 5, extensions: ['doc', 'pdf', 'png', 'jpg'] };
  // 设置上传的格式
  accept = null;
  loglist: any = [];
  tabviewindex: number;
  rsobj: any = {rstype: '', rsbeizhu: '', rsjine: '', rsweight: ''}; // 资源中心处理对象
  gcobj: any = {gctype: '', gcbeizhu: '', gcjine: '', gcweight: ''}; // 钢厂处理对象
  saleobj: any = {gctype: '', gcbeizhu: '', gcjine: '', gcweight: ''}; // 钢厂处理对象
  rstypes = [{ value: '1', label: '补重' }, { value: '2', label: '退款' }, { value: '3', label: '订货折让' }];
  salefeedbackobj = {logid: '', beizhu: '', qualityid: null}; // 销售业务反馈
  saletypes = [{ value: '1', label: '补差' }, { value: '2', label: '退货' }, { value: '3', label: '订货折让' }];
  isshowrsjine = true;
  chulitypes = [{ value: '1', label: '提报钢厂处理' }, { value: '2', label: '不提报钢厂资源中心处理' }, { value: '3', label: '物流处理' }, { value: '4', label: '仓库处理' }];
  // isshowgcjine = true;
  fujians: any = [];
  billnos: any = [];
  uploadflag = 1; // 1:异议跟踪弹窗 2:主表附件
  isshowgc = true;
  salebillno = ''; // 销售赔付单号
  rsbillno = ''; // 资源中心赔付单号
  oldquality = {};
  wuliuchuli = {};
  cangkuchuli = {};
  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');
  updatewaiwu:boolean = false;
  constructor(
    private qualityobjectionApi: QualityobjectionService,
    private storage: StorageService,
    private actroute: ActivatedRoute,
    public settings: SettingsService,
    private toast: ToasterService,
    private bsModalService: BsModalService,
    private router: Router,
    private classifyApi: ClassifyApiService) {
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
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true // 焦点离开停止编辑
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '提货单号', field: 'tihuobillno', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data.tihuoid) {
            return '<a target="_blank" href="#/tihuo/' + params.data.tihuoid + '">' + params.data.tihuobillno + '</a>';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'buyername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 100,
        editable: (params) => this.flag.isedit, onCellValueChanged: (params) => this.modityweight(params)
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 80,
        cellRenderer: (params) => {
          if (params.data.id && this.qualityobjection.status === 1) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        }, onCellClicked: (params) => {
          if (params.data.id && this.qualityobjection.status === 1) {
            sweetalert({
              title: '你确定要删除吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.qualityobjectionApi.deletequalitydet(params.data.id).then(data => {
                this.toast.pop('success', '删除成功！');
                this.getdetail();
                sweetalert.close();
              });
            });
          }
        }
      }
    ];
    this.gettype();
  }

  ngOnInit() {
    this.getdetail();
  }
  /**获取登录人和角色 */
  getcuser() {
    const curuser = JSON.parse(localStorage.getItem('cuser'));
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    if (myrole.some(item => item === 1) || curuser['id'] === this.qualityobjection['vuserid']) { // 审核人和管理员
      this.isshowgc = true;
    } else {
      this.isshowgc = false;
    }
  }
  getdetail() {
    this.qualityobjectionApi.getdetail(this.actroute.params['value']['id']).then(data => {
      this.qualityobjection = data.quality;
      this.wuliuchuli['qualityid'] = this.qualityobjection.id;
      this.cangkuchuli['qualityid'] = this.qualityobjection.id;      
      if (this.qualityobjection['vuserid'] === this.current.id) {
        this.updatewaiwu = true;
      }
      this.salebillno = this.qualityobjection.salebillno;
      this.rsbillno = this.qualityobjection.rsbillno;
      this.qualityobjection['oldsupplierid'] = data.quality['supplierid'];
      this.loglist = data['loglist'];
      this.fujians = data['fujians'];
      this.billnos = data['billnos'];
      if (this.qualityobjection['status'] === 1) {
        this.flag.isedit = true;
      } else {
        this.flag.isedit = false;
      }
      if (this.qualityobjection['status'] === 3 || this.qualityobjection['status'] === 4) {
        this.flag.isreportgc = true;
      } else {
        this.flag.isreportgc = false;
      }
      if (this.qualityobjection['status'] === 4) {
        this.flag.isResourceCenter = true;
      } else {
        this.flag.isResourceCenter = false;
      }
      if (this.qualityobjection['status'] === 6) {
        this.flag.issale = true;
      } else {
        this.flag.issale = false;
      }
      this.oldquality = JSON.parse(JSON.stringify(this.qualityobjection));
      this.gridOptions.api.setRowData(data.list);
      this.getcuser();
    });
  }
  /**打开引入明细弹窗 */
  showimporttihuodet() {
    this.bsModalService.config.class = 'modal-all';
    if(this.qualityobjection['subtype'] === '提单质量异议'){
      this.bsModalRef = this.bsModalService.show(TihuodetimportComponent);
    }else if(this.qualityobjection['subtype'] === '库存质量异议'){
      this.bsModalRef = this.bsModalService.show(KucunqualityimportComponent);
    }
    this.bsModalRef.content.parentThis = this;
  }
  hideimporttihuodet() {
    this.bsModalRef.hide();
    this.getdetail();
  }

  deletequality() {
    if (confirm('确定要删除吗？')) {
      this.qualityobjectionApi.deletequality(this.actroute.params['value']['id']).then(data => {
        this.toast.pop('success', '质量异议删除成功！');
        this.router.navigate(['qualityobjection']);
      });
    }
  }
  modbeizhu() {
    console.log(this.ifCompare(this.oldquality, this.qualityobjection));
    if (this.ifCompare(this.oldquality, this.qualityobjection)) {
      this.qualityobjectionApi.modify(this.qualityobjection).then(data => {
        this.toast.pop('success', '修改成功！');
        this.getdetail();
      });
    }
  }
  // 是否做出修改了
  ifCompare(object1, object2) {
    const o1keys = Object.keys(object1);
    const o2keys = Object.keys(object2);
    if (o2keys.length !== o1keys.length) {
      return true;
    }
    for (let i = 0; i <= o1keys.length - 1; i++) {
      const key = o1keys[i];
      if (!o2keys.includes(key)) {
        return true;
      }
      if (object2[key] !== object1[key]) {
        return true;
      }
    }
    return false;
  }
  reload() {
    this.qualityobjectionApi.makepdf(this.actroute.params['value']['id']).then(data => {
      this.toast.pop('success', data.msg);
    });
  }
  print() {
    this.qualityobjectionApi.print(this.actroute.params['value']['id']).then(data => {
      if (!data.flag) {
        this.toast.pop('warning', data.msg);
      } else {
        window.open(data.msg);
      }
    });
  }
  /**修改供应商 */
  opensupplier() {
    if (!this.flag.isedit) {
      return;
    }
    this.supplier = { supplierid: ''};
    this.supplierModal.show();
  }
  supplierclose() {
    this.supplierModal.hide();
  }
  confirmsupplier() {
    if (this.supplier['supplierid'] instanceof Object) {
      this.supplier['supplierid'] = this.supplier['supplierid'].code;
    } else {
      this.supplier['supplierid'] = null;
    }
    if (this.supplier['supplierid'] === null) {
      this.toast.pop('error', '请填写供应商！', '');
      return;
    }
    this.qualityobjection['supplierid'] = this.supplier['supplierid'];
    this.qualityobjectionApi.modify(this.qualityobjection).then(data => {
      this.toast.pop('success', '修改成功！');
      this.getdetail();
    }, err => {
      this.qualityobjection['supplierid'] = this.qualityobjection['oldsupplierid'];
    });
    this.supplierclose();
  }

  // 提交审核
  submitverify() {
    if (!this.fujians.length) {
      this.toast.pop('warning', '请添加附件后再提交！');
      return;
    }
    this.qualityobjectionApi.submitverify({id: this.qualityobjection['id'] }).then(data => {
      this.getdetail();
      this.toast.pop('success', '提交成功，审批中。。。！');
    });
  }
  /**打开提包钢厂弹窗/钢厂反馈记录 */
  opengongchang() {
    this.gangchangrecord = {beizhu: '', isurl: false, url: '', id: this.qualityobjection['id'], type: 1};
    this.gangchangrecordModal.show();
  }
  gangchangrecordclose() {
    this.gangchangrecordModal.hide();
  }
  confirmrecord() {
    if(!this.gangchangrecord['chulitype']){
      this.toast.pop('error', '请选择处理类型');
        return;
    }
    if(this.gangchangrecord['chulitype'] === '3'){
      if(!this.gangchangrecord['wuliuuser']){
        this.toast.pop('error', '物流员不能为空');
        return;
      }else{
        this.gangchangrecord['wuliuuserid'] = this.gangchangrecord['wuliuuser']['code'];
      }
    }
    if(this.gangchangrecord['chulitype'] === '4'){
      if(!this.gangchangrecord['cangkuuser']){
        this.toast.pop('error', '仓库负责人不能为空为空！');
        return;
      }else{
        this.gangchangrecord['cangkuuserid'] = this.gangchangrecord['cangkuuser']['code'];
      }
    }
    if (!this.gangchangrecord['beizhu'] && this.gangchangrecord['chulitype'] === '1') {
      this.toast.pop('error', '备注不能为空！');
      return;
    }
    if (this.qualityobjection['status'] === 4) {
      this.gangchangrecord.type = 2;
    } else {
      this.gangchangrecord.type = 1;
    }
    if (this.gangchangrecord['isurl']) {
      this.contractpic();
    } else {
      this.addrecord();
    }
  }
  // 附件上传弹窗
  contractpic() {
    this.uploadflag = 1;
    this.picdialog.show();
  }
  addrecord() {
    this.qualityobjectionApi.reportgc(this.gangchangrecord).then(data => {
      this.getdetail();
      this.gangchangrecordclose();
      this.tabviewindex = 1;
    });
  }
  // 上传成功执行的回调方法
  pictract($event) {
    if ($event.length !== 0) {
      if (this.uploadflag === 1) {
        this.gangchangrecord['url'] = $event.url;
        this.addrecord();
      } else {
        this.uploadfujian($event.url);
      }
    }
    this.hidepicDialog();
  }
  // 关闭上传弹窗
  hidepicDialog() {
    this.picdialog.hide();
  }
  /**资源中心处理弹窗 */
  showresourceCenterModal() {
    this.rsobj = {rstype: '', rsbeizhu: '', rsjine: '', rsweight: ''};
    this.resourceCenterModal.show();
  }
  closers() {
    this.resourceCenterModal.hide();
  }
  // rstypechange(event,flag) {
  //   if (event.value === '1') {
  //     if (flag === 1) {
  //       this.rsobj.rsjine = '';
  //       this.isshowrsjine = false;
  //     } else if (flag === 2) {
  //       this.gcobj.gcjine = '';
  //       this.isshowgcjine = false;
  //     }
  //   } else if (event.value === '2') {
  //     if (flag === 1) {
  //       this.rsobj.rsweight = '';
  //       this.isshowrsjine = true;
  //     } else if (flag === 2) {
  //       this.gcobj.gcweight = '';
  //       this.isshowgcjine = true;
  //     }
  //   }
  // }
  submitrs() {
    if (!this.rsobj.rstype) {
      this.toast.pop('error', '请填写处理类型！');
      return;
    }
    if (!this.rsobj.rsbeizhu) {
      this.toast.pop('error', '请填写处理说明！');
      return;
    }
    if (this.rsobj.rsjine === null || this.rsobj.rsjine === undefined || this.rsobj.rsjine === '') {
      this.toast.pop('error', '请填写金额！');
      return;
    }
    this.rsobj['id'] = this.qualityobjection['id'];
    this.qualityobjectionApi.centerchuli(this.rsobj).then(data => {
      this.getdetail();
      this.closers();
    });
  }
  showgangchangModal() {
    this.gcobj = {gctype: '', gcbeizhu: '', gcjine: '', gcweight: ''};
    this.gangchangModal.show();
  }
  closegc() {
    this.gangchangModal.hide();
  }
  submitgc() {
    if (!this.gcobj.gctype) {
      this.toast.pop('error', '请填写处理类型！');
      return;
    }
    if (!this.gcobj.gcbeizhu) {
      this.toast.pop('error', '请填写处理说明！');
      return;
    }
    if (this.gcobj.gcjine === null || this.gcobj.gcjine === undefined || this.gcobj.gcjine === '') {
      this.toast.pop('error', '请填写金额！');
      return;
    }
    this.gcobj['id'] = this.qualityobjection['id'];
    this.qualityobjectionApi.gcchuli(this.gcobj).then(data => {
      this.getdetail();
      this.closegc();
    });
  }
  // 修改明细重量
  modityweight(params) {
    if (!this.flag.isedit) {
      return;
    }
    const obj = {};
    obj['weight'] = params.data.weight;
    obj['id'] = params.data.id;
    this.qualityobjectionApi.modifydet(obj).then(data => {
      this.toast.pop('success', '修改成功');
      this.getdetail();
    }, err => {
      params.node.data.weight = params.oldValue;
      params.node.setData(params.node.data);
    });
  }
  /**销售业务处理弹窗 */
  showsaleModal() {
    this.saleobj = {saletype: '', salebeizhu: '', salejine: ''};
    this.saleModal.show();
  }
  closesale() {
    this.saleModal.hide();
  }
  submitsale() {
    if (!this.saleobj.saletype) {
      this.toast.pop('error', '请填写处理类型！');
      return;
    }
    if (!this.saleobj.salebeizhu) {
      this.toast.pop('error', '请填写处理说明！');
      return;
    }
    if (this.saleobj.salejine === null || this.saleobj.salejine === undefined || this.saleobj.salejine === '') {
      this.toast.pop('error', '请填写金额！');
      return;
    }
    this.saleobj['id'] = this.qualityobjection['id'];
    this.qualityobjectionApi.salechuli(this.saleobj).then(data => {
      this.getdetail();
      this.closesale();
    });
  }
  /**附件弹窗 */
  showfujianmodal() {
    this.fujianModal.show();
  }
  closefujian() {
    this.fujianModal.hide();
  }
  delfujian(key) {
    const params = {id: this.qualityobjection['id'], key: key};
    this.qualityobjectionApi.delfujian(params).then(data => {
      this.getdetail();
    });
  }
  fujiansubmit() {
    this.uploadflag = 2;
    this.picdialog.show();
  }
  uploadfujian(url) {
    const params = {id: this.qualityobjection['id'], url: url};
    this.qualityobjectionApi.uploadfujian(params).then(data => {
      this.getdetail();
    });
  }
  modifbillno(billno, flag) {
    if (flag === 1) {
      if (this.qualityobjection['rsbillno'] === billno) {
        return;
      }
      const obj = {rsbillno: billno, flag: 1, id: this.qualityobjection.id};
      this.qualityobjectionApi.modifbillno(obj).then(data => {
        this.getdetail();
      });
    } else if (flag === 2) {
      if (this.qualityobjection['salebillno'] === billno) {
        return;
      }
      const obj = {salebillno: billno, flag: 2, id: this.qualityobjection.id};
      this.qualityobjectionApi.modifbillno(obj).then(data => {
        this.getdetail();
      });
    }
  }
  /**获取异议类型 */
  gettype() {
    this.types = [];
    this.classifyApi.listclassify('qualityobjection_type').then(data => {
      data.forEach(element => {
        this.types.push({
          label: element.name,
          value: element.id
        });
      });
    });
  }
  /**打开销售反馈弹窗 */
  showsalefeedbackmodal(logid) {
    this.salefeedbackModal.show();
    this.salefeedbackobj = {logid: logid, beizhu: '', qualityid: this.qualityobjection.id};
  }
  salefeedbackclose() {
    this.salefeedbackModal.hide();
  }
  confirmsalefeedback() {
    if (!this.salefeedbackobj.beizhu) {
      this.toast.pop('error', '请填写备注！');
      return;
    }
    this.qualityobjectionApi.salefeedback(this.salefeedbackobj).then(data => {
      this.salefeedbackclose();
      this.getdetail();
    });
  }
  wuliuchulishow(){
    this.wuliuchuliModel.show();
  }
  cangkuchulishow(){
    this.cangkuchuliModel.show();
  }
  closewuliu(){
    this.wuliuchuliModel.hide();
  }
  closecangku(){
    this.cangkuchuliModel.hide();
  }
  cancelShow(){
    this.cancelModel.show();
  }
  closecancel(){
    this.cancelModel.hide();
  }
  //物流处理
  submitwuliu(){
    if(!this.wuliuchuli['wlbeizhu']){
      this.toast.pop('error', '请填写处理说明！');
      return;
    }
    this.qualityobjectionApi.submitwuliu(this.wuliuchuli).then(data => {
      this.getdetail();
      this.closewuliu();
    });
  }
  //仓库处理
  submitcangku(){
    if(!this.cangkuchuli['ckbeizhu']){
      this.toast.pop('error', '请填写处理说明！');
      return;
    }
    this.qualityobjectionApi.submitcangku(this.cangkuchuli).then(data => {
      this.getdetail();
      this.closecangku();
    });
  }
  cancel(){
    if(!this.qualityobjection['cancelbeizhu']){
      this.toast.pop('error', '请填写原因！');
      return;
    }
    console.log(this.qualityobjection['cancelbeizhu']);
    
    this.qualityobjectionApi.cancel(this.qualityobjection).then(data => {
      this.getdetail();
      this.closecancel();
    });
  }
  showbillonmodal() {
    this.getdetail();
    this.billnoModel.show();
  }
  closebillno() {
    this.billnoModel.hide();
  }
  billnosubmit(){
    this.billnoModel2.show();
  }
  closebillnoModel2(){
    this.billnoModel2.hide();
  }
  billno = {};
  savebillno(){
    this.billno['quailtyid'] = this.qualityobjection['id'];
    this.qualityobjectionApi.addbillnos(this.billno).then(data => {
      this.getdetail();
      this.closebillnoModel2();
    });
  }
  delbillno(key) {
    const params = {id: this.qualityobjection['id'], key: key};
    this.qualityobjectionApi.delbillno(params).then(data => {
      
    });
    this.getdetail();
  }
  
}
