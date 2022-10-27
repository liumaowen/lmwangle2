import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FavoritelistComponent } from './../../../dnn/shared/favoritelist/favoritelist.component';
import { KucundetimportComponent } from './../../../dnn/shared/kucundetimport/kucundetimport.component';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { StorageService } from './../../../dnn/service/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { InnersaleapiService } from './../innersaleapi.service';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QualityobjectionimportComponent } from 'app/dnn/shared/qualityobjectionimport/qualityobjectionimport.component';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-innersaledetail',
  templateUrl: './innersaledetail.component.html',
  styleUrls: ['./innersaledetail.component.scss']
})
export class InnersaledetailComponent implements OnInit {
  @ViewChild('priceModal') private priceModal: ModalDirective;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  priceForm: FormGroup;
  isimport = { flag: true };
  // 引入库存弹窗对象
  kcbsModalRef: BsModalRef;

  // 引入收藏夹弹窗对象
  favbsModalRef: BsModalRef;
  //引入质量异议
  zlbsModalRef: BsModalRef;

  gridOptions: GridOptions;
  suser;
  ssuser;
  innersale = {};
  category = '';
  customer = {};
  // 获取当前用户
  current = this.storage.getObject('cuser');

  // 控制是否显示按钮
  flag = {};


  sprice = {};

  saleList = new Array();
  rstypes = [{ value: '1', label: '补重' }, { value: '2', label: '退款' }, { value: '3', label: '订货折让' }];
  constructor(public settings: SettingsService, private innersaleApi: InnersaleapiService, private toast: ToasterService,
    private route: ActivatedRoute, private storage: StorageService, private modalService: BsModalService, private router: Router,
    private fb: FormBuilder) {

    this.priceForm = fb.group({
      'price': [null, Validators.compose([Validators.required, Validators.pattern('^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$')])]
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
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
      getNodeChildDetails: (rowItem) => {
        if (rowItem.group) {
          return {
            group: true,
            expanded: rowItem.group === '彩涂卷' || rowItem.group === '镀锌' || rowItem.group === '镀铝锌'
              || rowItem.group === '洁彩' || rowItem.group === '恒牧' || rowItem.group === '辉彩'
              || rowItem.group === '锌铝镁' || rowItem.group === '冷轧' || rowItem.group === '铝锌镁',
            children: rowItem.participants,
            field: 'group',
            key: rowItem.group
          };
        } else {
          return null;
        }
      }// 这个是获取孩子列表的
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;


    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'group', minWidth: 90,
      checkboxSelection: true, headerCheckboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 300 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 120 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '件数', field: 'count', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '<font color="red">采购价格</font>', field: 'feeprice',
        valueFormatter: this.settings.valueFormatter2, minWidth: 90, editable: true,
        cellRenderer: (params) => {
          if (params.data.isedit) {
            if (params.value === null || params.value === undefined) {
              return null;
            } else if (isNaN(params.value)) {
              return 'NaN';
            } else {
              return params.value;
            }
          } else {
            params.colDef.editable = false;
            return params.value;
          }
        },
        onCellClicked: (params) => {
          if (this.innersale['cuserid'] === this.current['id']) {
            if (!this.innersale['isv']) {
              if (params.data.isedit) {
                this.sprice = {};
                this.sprice['gcid'] = params.data.gcid;
                this.sprice['cangkuid'] = params.data.cangkuid;
                this.showPriceDialog();
              }
            }
          }
        }

      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data.del) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (params.data.del) {
            if (confirm('你确定要删除吗？')) {
              this.innersaleApi.removeOneDet(params.data.id).then((response) => {
                this.listDetail();
                if (this.saleList.length > 0) {
                  for (let i = 0; i < this.saleList.length; i++) {
                    if (this.saleList[i].id === params.data.id) {
                      this.saleList.splice(i, 1); // 删除重复的
                    }
                  }
                }
              });
            }
            // sweetalert({
            //   title: '你确定引入收藏夹中的货物创建内采单吗？',
            //   type: 'warning',
            //   showCancelButton: true,
            //   confirmButtonColor: '#23b7e5',
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   closeOnConfirm: false
            // }, () => {
            //   this.innersaleApi.removeOneDet(params.data.id).then((response) => {
            //     this.listDetail();
            //     if (this.saleList.length > 0) {
            //       for (let i = 0; i < this.saleList.length; i++) {
            //         if (this.saleList[i].id === params.data.id) {
            //           this.saleList.splice(i, 1); // 删除重复的
            //         }
            //       }
            //     }
            //   });
            // });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', minWidth: 90,
        cellRenderer: (params) => {
          return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';

        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细id', field: 'id', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '货物价格', field: 'kucunprice', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      }

    ];

    this.listDetail();
  }

  ngOnInit() {
    this.listDetail();
  }

  // 获取aggird 表格
  listDetail() {
    this.innersaleApi.listInnersale(this.route.params['value']['id']).then(data => {
      this.innersale = data;
      if (this.innersale['cuserid'] === this.current['id']) {
        if (!this.innersale['isv']) {
          this.flag['save'] = true;
          this.flag['submitV'] = true;
        } else {
          this.flag['save'] = false;
          this.flag['submitV'] = false;
        }
      } else {
        this.flag['save'] = false;
        this.flag['submitV'] = false;
      }
      // 买方审核按钮控制
      // if (this.innersale['vuserid'] === this.current['id']) {
      //   if (!this.innersale['isv']) {
      //     this.flag['verify'] = true;
      //   } else {
      //     this.flag['verify'] = false;
      //   }
      // } else {
      //   this.flag['verify'] = false;
      // }
      // 卖方审核按钮控制
      // if (this.innersale['svuserid'] === this.current['id']) {
      //   if (!this.innersale['issv']) {
      //     this.flag['sverify'] = true;
      //   } else {
      //     this.flag['sverify'] = false;
      //   }
      // } else {
      //   this.flag['sverify'] = false;
      // }
      // 是否回退
      // if (this.innersale['svuserid'] === this.current['id'] || this.innersale['vuserid'] === this.current['id']) {
      //   if (this.innersale['vuserid'] != null && !this.innersale['issv']) {
      //     this.flag['isback'] = true;
      //   } else {
      //     this.flag['isback'] = false;
      //   }
      // } else {
      //   this.flag['isback'] = false;
      // }

      if (this.innersale['svuserid']) {
        this.flag['refresh'] = true;
      } else {
        this.flag['refresh'] = false;
      }
      this.getCategory();
      this.getrstypename();
    });

    this.innersaleApi.listInnersaleDet(this.route.params['value']['id']).then(data => {
      this.gridOptions.api.setRowData(data);
      if(data.length) this.innersale['orgtype'] = data[0]['orgtype'];
      if (this.innersale['isv']) {
        this.gridOptions.columnApi.setColumnVisible('amount', false);
      }
    });
  }

  // 填写备注
  updateInnersale() {
    this.innersaleApi.updateInnersale(this.innersale).then(data => {
      this.toast.pop('success', '更新成功^_^');
      this.innersale = data['innersale'];
      this.listDetail();
    });
    // sweetalert({
    //   title: '你确定引入收藏夹中的货物创建内采单吗？',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#23b7e5',
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   closeOnConfirm: false
    // }, () => {
    //   this.innersaleApi.updateInnersale(this.innersale).then(data => {
    //     this.toast.pop('success', '更新成功^_^');
    //     this.innersale = data['innersale'];
    //     this.listDetail();
    //   });
    //   sweetalert.close();
    // });
  }
  showPriceDialog() {
    this.priceModal.show();
  }

  hidePriceDialog() {
    this.priceModal.hide();
  }

  modifyprice() {
    if (this.sprice['feeprice']) {
      this.sprice['innersaleid'] = this.innersale['id'];
      this.innersaleApi.changeFeeprice(this.sprice).then(() => {
        this.listDetail();
        this.toast.pop('success', '价格修改成功');
      });
    }
    this.hidePriceDialog();
  }
  // 引入库存弹窗
  importKucun() {
    this.modalService.config.class = 'modal-all';
    this.kcbsModalRef = this.modalService.show(KucundetimportComponent);
    this.kcbsModalRef.content.isimport = this.isimport;
    this.kcbsModalRef.content.componentparent = this;
  }
  // 引入库存页面的回调
  innersaleKucun(data) {
    console.log('引入库存页面的回调', data);
    this.kcbsModalRef.hide();
    this.innersale = data['innersale'];
    let gc = data['dets'];
    this.innersaleApi.listInnersaleDet(this.route.params['value']['id']).then(response => {
      this.gridOptions.api.setRowData(response);
      if (this.innersale['isv']) {
        this.gridOptions.columnApi.setColumnVisible('amount', false);
      }
    });
  }

  choice(){
    if(!this.innersale['rstype']){
      this.toast.pop('warning', '请填写类型！');
      return;
    }
    if(this.innersale['rsjine']===null){
      this.toast.pop('warning', '请填写金额！');
      return;
    }
    if(!this.innersale['rsbeizhu']){
      this.toast.pop('warning', '请填写说明！');
      return;
    }
    this.addModal.hide();
    this.modalService.config.class = 'modal-all';
    this.zlbsModalRef = this.modalService.show(QualityobjectionimportComponent);
    this.zlbsModalRef.content.isimport = this.isimport;
    this.zlbsModalRef.content.innersale = this.innersale;
    this.zlbsModalRef.content.parent = this;
  }
  // 引入收藏夹弹窗
  importFav() {
    if (this.storage.getObject('fav')) {
      this.modalService.config.class = 'modal-all';
      this.favbsModalRef = this.modalService.show(FavoritelistComponent);
      this.favbsModalRef.content.isimport = this.isimport;
      this.favbsModalRef.content.parentthis = this;
    } else {
      this.toast.pop('warning', '收藏夹中没有货物！！！');
    }
  }

  // 引入收藏夹页面的回调
  innersaleFav(data) {
    this.favbsModalRef.hide();
    this.innersale = data.innersale;
    let gc = data.dets;
    this.innersaleApi.listInnersaleDet(this.route.params['value']['id']).then((response) => {//从服务器获取数据赋值给网格
      this.gridOptions.api.setRowData(response);
      if (this.innersale['isv']) {
        this.gridOptions.columnApi.setColumnVisible('amount', false);
      }
    });
  }

  // 删除未审核表单
  removebill(model) {
    if (model.isv) {
      this.toast.pop('warning', '单据已审核不允许删除！！！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.innersaleApi.removeInnersale(model.id).then((data) => {
        this.toast.pop('success', '删除成功');
        this.router.navigateByUrl('innersaledetreport');
      });
    }
    // sweetalert({
    //   title: '你确定要删除吗？',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#23b7e5',
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   closeOnConfirm: false
    // }, () => {
    //   this.innersaleApi.removeInnersale(model.id).then((data) => {
    //     this.toast.pop('success', '删除成功');
    //     this.router.navigateByUrl('innersalereport');
    //   });
    //   sweetalert.close();
    // });
  }

  refreshprice() {
    if (confirm('你确定刷新货物的价格吗？')) {
      this.innersaleApi.refreshprice(this.innersale['id']).then(() => {
        this.toast.pop('success', '刷新成功^_^');
        // Notify.alert("刷新成功^_^", { status: 'success' });
        this.listDetail();
      });
    }
    // sweetalert({
    //   title: '你确定刷新货物的价格吗？',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#23b7e5',
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   closeOnConfirm: false
    // }, () => {
    //   this.innersaleApi.refreshprice(this.innersale['id']).then(() => {
    //     this.toast.pop('success', '刷新成功^_^');
    //     // Notify.alert("刷新成功^_^", { status: 'success' });
    //     this.listDetail();
    //   });
    //   sweetalert.close();
    // });
  }

  // submitVerify() {
  //   if (confirm('你确定提交审核吗？')) {
  //     this.showDialog();
  //   }
  //   // sweetalert({
  //   //   title: '你确定提交审核吗？',
  //   //   type: 'warning',
  //   //   showCancelButton: true,
  //   //   confirmButtonColor: '#23b7e5',
  //   //   confirmButtonText: '确定',
  //   //   cancelButtonText: '取消',
  //   //   closeOnConfirm: false
  //   // }, () => {
  //   //   this.showDialog();
  //   //   sweetalert.close();
  //   // });

  // }

  showDialog() {
    this.classicModal.show();
  }

  hideDialog() {
    this.classicModal.hide();
  }

  // submitVuser() {
  //   if (this.innersale['isv']) {
  //     this.toast.pop('warning', '内采单已经审核了！！！');
  //     // Notify.alert("内采单已经审核了！！！", { status: 'warning' });
  //     return '';
  //   }
  //   if (typeof (this.suser) === 'object' && typeof (this.ssuser) === 'object') {
  //     this.innersaleApi.zhidingVuser(this.innersale['id'], { vuserid: this.suser['code'],svuserid: this.ssuser['code'] }).then(data => {
  //       this.innersale['vuser'] = data.innersale.vuser;
  //       // 关闭弹窗
  //       this.hideDialog();

  //       this.toast.pop('success', '提交成功^o^');
  //       this.listDetail();
  //       // this.router.navigateByUrl('innersalereport');
  //       // this.router.navigate(['innersaledetreport']);
  //     });
  //   } else {
  //     this.toast.pop('warning', '请选择单据审核人！！！');
  //   }
  // }
  submitVuser() {
    if(this.innersale['category'] === 4 && !this.innersale['zhiliangyiyibillno']){
      this.toast.pop('warning', '类型为处理质量异议，必须关联质量异议！');
      return '';
    }
    if (this.innersale['isv']) {
      this.toast.pop('warning', '内采单已经审核了！！！');
      // Notify.alert("内采单已经审核了！！！", { status: 'warning' });
      return '';
    }
    this.innersaleApi.zhidingVuser(this.innersale['id']).then(data => {
      this.innersale['vuser'] = data.innersale.vuser;
      this.router.navigateByUrl('innersale');
      this.router.navigate(['innersale']);
      this.toast.pop('success', '提交成功^o^');
      this.listDetail();
    });
  }

  // verify(id, version) {
  //   if (confirm('你确定要审核吗？')) {
  //     this.innersaleApi.verifyInnersale({ id: id, version: version }).then(data => {
  //       this.toast.pop('success', '审核成功^_^');
  //       this.listDetail();
  //       // this.router.navigateByUrl('innersalereport');
  //       // this.router.navigate(['innersaledetreport']);
  //     });
  //   }
  // }
  // sverify(id, version) {
  //   if (confirm('你确定要审核吗？')) {
  //     this.innersaleApi.sverifyInnersale({ id: id, version: version }).then(data => {
  //       this.toast.pop('success', '审核成功^_^');
  //       this.listDetail();
  //       // this.router.navigateByUrl('innersalereport');
  //       // this.router.navigate(['innersaledetreport']);
  //     });
  //   }
  // }
  // back(id) {
  //   if (confirm('你确定提交审核吗？')) {
  //     this.innersaleApi.back(id).then(data => {
  //       this.toast.pop('success', '回退成功^_^');
  //       this.listDetail();
  //     });
  //   }
  // }
  @ViewChild('addModal') private addModal: ModalDirective;
  showaddModal() {
    this.addModal.show();
  }
  hideaddModal() {
    this.addModal.hide();
  }
  addtype = [
    { label: '请选择类型', value: '' },
    { label: '正常', value: 1 },
    { label: '调拨', value: 2 },
    { label: '竞价', value: 3 },
    { label: '处理质量异议', value: 4 },
    { label: '处理机构长期库存', value: 5 },
    { label: '加工', value: 6 }
  ];
  getCategory() {
    let category = this.innersale['category'];
    if (category === null || category === undefined) {
      this.category = '';
    } else if (category === 1) {
      this.category = '正常';
    } else if (category === 2) {
      this.category = '调拨';
    } else if (category === 3) {
      this.category = '竞价';
    } else if (category === 4) {
      this.category = '处理质量异议';
    } else if (category === 5) {
      this.category = '处理机构长期库存';
    } else if (category === 6) {
      this.category = '加工';
    }
  }
  rstypename;
  getrstypename() {
    let rstype = this.innersale['rstype'];
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
  update() {
    this.showaddModal();
  }
  addreason() {
    if (typeof (this.customer) === 'object') {
      this.innersale['customerid'] = this.customer['code'];
    } else {
      this.innersale['customerid'] = '';
    }
    if (this.innersale['category'] === 3 && !this.innersale['reason']) {
      this.toast.pop('warning', '请填写竞价说明！！！');
      return;
    }
    if (this.innersale['category'] !== 3) {
      this.innersale['reason'] = '';
    }
    this.innersaleApi.updateInnersale(this.innersale).then(data => {
      if (data) {
        this.listDetail();
        this.hideaddModal();
      }
    });
  }
    //批量删除内采单明细
     innersaleids: any = [];
      delinnersale() {
      this.innersaleids = new Array();
      const innersalelist = this.gridOptions.api.getModel()['rowsToDisplay'];
      for (let i = 0; i < innersalelist.length; i++) {
        if (innersalelist[i].selected && innersalelist[i].data && innersalelist[i].data['id']) {
          this.innersaleids.push(innersalelist[i].data.id);
        }
      }
      if (!this.innersaleids.length) { 
        this.toast.pop('warning', '请选择明细之后再删除！');
        return;
      }
      console.log(this.innersaleids)
      if (confirm('你确定要删除吗？')) {
       this.innersaleApi.removeDet(this.innersaleids).then(data => {
          this.toast.pop('success', '删除成功！'); 
          this.listDetail();

     });
      }
    } 

  
}
