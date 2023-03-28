import { element } from 'protractor';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FproductimportComponent } from './../../../dnn/shared/fproductimport/fproductimport.component';
import { TasklistdetimportComponent } from './../../../dnn/shared/tasklistdetimport/tasklistdetimport.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { GridOptions } from 'ag-grid/main';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduceapiService } from './../produceapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { XiaoshouapiService } from 'app/routes/xiaoshou/xiaoshouapi.service';
import { isEmpty } from 'lodash';
const sweetalert = require('sweetalert');
@Component({
  selector: 'app-producedetail',
  templateUrl: './producedetail.component.html',
  styleUrls: ['./producedetail.component.scss']
})
export class ProducedetailComponent implements OnInit {
  @ViewChild('producefeeModal') private producefeeModal: ModalDirective;
  tasklist = { cuser: {} };
  detids;
  feecollectid;
  // 内部销售单的展示
  produce: any = { isv: false };
  producefee = {};
  producefee2 = {};
  // 定义一个成品编辑对象
  fpedit = {};
  modifytask = {};
  producelist = { cuser: {} };
  showbutton = {};
  chanpin = { typecode: 3 };
  basematerialImpbsModalRef: BsModalRef;

  fproductImpbsModalRef: BsModalRef;

  gridOptions: GridOptions;
  feegridOptions: GridOptions;

  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');
  producefeetype = [{ label: '请选择', value: '' }, { label: '纵剪费', value: 6 },
  { label: '开平费', value: 5 }, { label: '出库费', value: 4 }];

  constructor(public settings: SettingsService, private storage: StorageService, private produceApi: ProduceapiService,
    private route: ActivatedRoute, private toast: ToasterService, private router: Router, private bsModalService: BsModalService,
    private tihuoApi: XiaoshouapiService) {

    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      // 分组显示
      // debug: true,
      getNodeChildDetails: (rowItem) => {
        if (rowItem.group) {
          return {
            group: true,
            expanded: null != rowItem.group,
            children: rowItem.participants,
            field: 'group',
            key: rowItem.group
          };
        } else {
          return null;
        }
      },
      // 这个是获取孩子列表的
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
      getContextMenuItems: (params) => {
        let result = [];
        if (params.node !== null) {
          if (params.node.data.fptype == null && this.showbutton['imp'] === true) {
            result = [
              {
                name: '引入',
                subMenu: [
                  {
                    name: '成品',
                    action: () => {
                      if (this.produce['jgdwid'] !== 3786) {
                        this.fproductImp(params.node.data);
                      } else {
                        this.toast.pop('warning', '添加成品请上传验收单！');
                      }
                    }
                  },
                  {
                    name: '余卷',
                    action: () => { this.remainImp(params.node.data); }
                  },
                  {
                    name: '边料/边丝',
                    action: () => { this.biansiImp(params.node.data); }
                  }
                ]
              },
              'copy',
            ];
          } else {
            result = [
              'copy',
            ];
          }
        }
        return result;
      },
    }
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 90, checkboxSelection: true, headerCheckboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'group', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangku', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', width: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '数量', field: 'amount', width: 90,
        valueFormatter: this.settings.valueFormatter
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否入资源中心', field: 'iskucundetail', width: 110 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '成品类型', field: 'fptype', width: 90,
        // cellRenderer: (params) => {
        //   if (params.data.fptype === 1) {
        //     return '成品';
        //   } else if (params.data.fptype === 2) {
        //     return '余卷';
        //   } else if (params.data.fptype === 3) {
        //     return '边料';
        //   } else if (params.data.fptype === 4) {
        //     return '边丝';
        //   } else {
        //     return '';
        //   }
        // }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', width: 100,
        cellRenderer: (params) => {
          if (!this.produce['isv']) {
            return '<a ng-hide="produce.isv" target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          this.fpedit = {};
          this.fpedit['kunbaohao'] = params.data.kunbaohao;
          this.fpedit['fpid'] = params.data.fpid;
          if (!this.produce['isv']) {
            if (params.data.isbm) {// 删除基料
              if (confirm('你确定删除这个基料吗？')) {
                this.produceApi.removeBm(params.data.id).then(() => {
                  // Notify.alert('删除成功', { status: 'success' });
                  this.toast.pop('success', '删除成功');
                  this.getDetail();
                })
              }
            } else {// 删除成品
              if (confirm('你确定删除这个成品吗？')) {
                this.produceApi.removeFp(params.data.fpid).then(() => {
                  // Notify.alert('删除成功', { status: 'success' });
                  this.toast.pop('success', '删除成功');
                  this.getDetail();
                });
              }
            }
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 90,
        cellRenderer: (params) => {
          if (params.data.kucunid) {
            return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
          } else {
            return '';
          }


        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细id', field: 'id', width: 90 }
    ];
    this.feegridOptions = {
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
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true, // 焦点离开停止编辑
      getContextMenuItems: this.settings.getContextMenuItems,
      onRowSelected: (params) => {
        if (params.data.group && params.node['selected']) {
          let childs = params.node.childrenAfterGroup;
          childs.forEach(data => {
            data.selectThisNode(true);
          })
        }
      },
      getNodeChildDetails: (params) => {
        if (params.group) {
          return { group: true, children: params.participants, field: 'group', key: params.group };
        } else {
          return null;
        }
      }
    };
    this.feegridOptions.onGridReady = this.settings.onGridReady;
    this.feegridOptions.groupSuppressAutoColumn = true;
    // 设置费用明细的表格数据
    this.feegridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'group', minWidth: 100, cellRenderer: 'group',
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'type', width: 120,
        cellRenderer: (params) => {
          if (params.data.type === 1) {
            return '汽运费';
          } else if (params.data.type === 2) {
            return '铁运费';
          } else if (params.data.type === 3) {
            return '船运费';
          } else if (params.data.type === 4) {
            return '出库费';
          } else if (params.data.type === 5) {
            return '开平费';
          } else if (params.data.type === 6) {
            return '纵剪费';
          } else if (params.data.type === 7) {
            return '销售运杂费';
          } else if (params.data.type === 8) {
            return '包装费';
          } else if (params.data.type === 9) {
            return '仓储费';
          } else if (params.data.type === 10) {
            return '保险费';
          } else if (params.data.type === 11) {
            return '押车费';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际费用单位', field: 'actualfeename', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feename', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用支付', field: 'isdianfu', width: 80,
        cellRenderer: (params) => {
          if (params.data.isdianfu) {
            return '垫付';
          } else {
            return '普通';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '记账方向', field: 'accountdirection', width: 80,
        cellRenderer: (params) => {
          if (params.data.accountdirection === 1) {
            return '采购';
          } else if (params.data.accountdirection === 2) {
            return '销售';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '应收应付', field: 'payorreceive', width: 80,
        cellRenderer: (params) => {
          if (params.data.payorreceive === 1) {
            return '应付';
          } else if (params.data.payorreceive === 2) {
            return '应收';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 80,
        valueFormatter: this.settings.valueFormatter3
      },
     
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2,
        cellRenderer: (params) => {
          if (params.data.price) {
            if (params['data']['group']) {
              return `<a>${params.data.price}</a>`;
            } else {
              return params.data.price + '';
            }
          }
        }, onCellClicked: (params) => {
          if (params.data.group) {
            this.openmodify(params);
          }
        }
      },
   
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 80,
        valueFormatter: this.settings.valueFormatter2,
        cellRenderer: (params) => {
          if (params.data.jine) {
            if (params['data']['group']) {
              return `<a>${params.data.jine}</a>`;
            } else {
              return params.data.jine + '';
            }
          }
        }, onCellClicked: (params) => {
          if ( params.data.group) {
            this.openmodify(params);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '内部单价', field: 'innerprice', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '内部金额', field: 'innerjine', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '库存id', field: 'kucunid', width: 80 },
      { cellStyle: { 'text-align': 'right' }, headerName: '捆包号', field: 'kunbaohao', width: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', width: 80,
        cellRenderer: (params) => {
          if (params.data.group) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (params.data.group) {

            sweetalert({
              title: '你确定删除此条费用明细吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.produceApi.removeProducefee(params.data.group).then((response) => {
                // Notify.alert('删除成功！！！', { status: 'success' });
                this.toast.pop('success', '删除成功！！！');
                this.listFeeDetail();
              });
              sweetalert.close();
            });
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'miaoshu', width: 120 }
    ];
    this.getProduce();
    this.getDetail();
    this.listFeeDetail();
  }
  
  ngOnInit() {
  }
  // 获取主表信息
  getProduce() {
    this.produceApi.get(this.route.params['value']['id']).then((data) => {
      console.log(data);
      this.produce = data;
      if (this.produce['cuserid'] === this.current['id']) {
        if (!this.produce['isv']) {
          this.showbutton['imp'] = true;
          this.showbutton['check'] = true;
        }
      }
    });
  }

  // 获取明细表中的信息
  getDetail() {
    this.produceApi.getDetail(this.route.params['value']['id']).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }
  feelist = [];
  /**运费明细 */
  listFeeDetail() {
    this.tihuoApi.listFeeDetail({ tihuoid: this.route.params['value']['id'] }).then((response) => {
      this.feegridOptions.api.setRowData(response);
      this.feelist = response;
    });
  }
  // 删除仓库
  removeById(id) {
    if (confirm('你确定要删除吗？')) {
      this.produceApi.removeById(id).then(() => {
        this.toast.pop('success', '删除成功');
        this.router.navigateByUrl('myproduce');
      });
    }
  }

  // 基料引入
  basematerialImp() {
    this.bsModalService.config.class = 'modal-all';
    this.basematerialImpbsModalRef = this.bsModalService.show(TasklistdetimportComponent);
    this.basematerialImpbsModalRef.content.parentthis = this;
  }

  impBm() {
    this.basematerialImpbsModalRef.hide();
    this.getProduce();
    this.getDetail();
  }

  // 成品引入
  msg = {};

  // 判断是不是选择了基料
  fproductImp(data) {
    console.log(data);
    if (this.produce['isv']) {
      this.toast.pop('warning', '加工单已经验收！！！');
      return '';
    }
    if (!data.isbm) {
      this.toast.pop('warning', '请选择基料的货物！！！');
      // Notify.alert('请选择基料的货物！！！', { status: 'warning' });
      return '';
    }
    this.msg['baseSub'] = data;
    this.msg['proorderid'] = data.orderid;// 展示的时候要展示该合同中所有的成品，所以要有合同ID
    this.msg['basematerialid'] = data.id;
    this.msg['kunbaohao'] = data.kunbaohao;
    this.bsModalService.config.class = 'modal-all';
    this.fproductImpbsModalRef = this.bsModalService.show(FproductimportComponent);
    this.fproductImpbsModalRef.content.parentthis = this;

    // ngDialog.open({
    //   template: 'views/produce/fproduct_imp_dialog.html',
    //   scope: $scope,
    //   className: 'ngdialog-theme-default ngdialog-width-1250',
    //   closeByDocument: false,
    //   closeByEscape: false,
    //   showClose: true
    // });

  };


  impFp(data) {
    // ngDialog.close();
    this.fproductImpbsModalRef.hide();
    this.getProduce();
    this.getDetail();
    // 接收子页面传过的值。然后进行筛选并让它默认选中
    let baseSub = data.baseSub;
    this.gridOptions.api.forEachNode((node) => {
      if (node.data === baseSub) {
        node.setSelected(true, true);
      }
    });
  }

  // 修改成品
  modifyFp() {
    console.log(this.fpedit);
    if (confirm('你确定要修改吗？')) {
      this.toast.pop('warning', '没有modifyFp方法请联系管理员');
      console.log('http请求方法没有，请添加！');
      // this.produceApi.modifyFp(this.fpedit).then((data)=> {
      //   this.fproductImpbsModalRef.hide();
      //   this.toast.pop('success', '修改成功');
      //   this.getProduce();
      //   this.getDetail();
      // });
    }
  }

  // 余卷引入
  remainedit = {};
  remainImp(data) {
    console.log(data);
    if (this.produce['isv']) {
      this.toast.pop('warning', '加工单已经验收！！！');
      // Notify.alert('加工单已经验收！！！', { status: 'warning' });
      return '';
    }
    if (!data.isbm) {
      this.toast.pop('warning', '请选择基料的货物！！！');
      // Notify.alert('请选择基料的货物！！！', { status: 'warning' });
      return '';
    }
    this.remainedit['bmid'] = data.id;
    this.showremainImport();
    // ngDialog.open({
    //   template: 'views/produce/remain_imp_dialog.html',
    //   scope: $scope,
    //   className: 'ngdialog-theme-default ngdialog-width-600',
    //   closeByDocument: false,
    //   closeByEscape: false,
    //   showClose: true
    // });

  }

  // 添加余卷
  addReproduct() {
    if (this.remainedit['weight']) {
      // console.log($scope.remainedit);
      if (confirm('你确定添加吗？')) {
        this.produceApi.addRemain(this.remainedit).then((data) => {
          // ngDialog.close();
          this.hideremainImport();
          this.toast.pop('success', '添加成功');
          // Notify.alert('添加成功', { status: 'success' });
          this.getProduce();
          this.getDetail();
          // 添加余卷页面显示添加余卷的条例
          this.gridOptions.api.forEachNode((node) => {
            if (node.data === this.remainedit) {
              node['selectAll']();
            }
          });
        });
      }
    } else {
      this.toast.pop('warning', '请填写重量');
      return;
    }
  }

  // 边丝引入
  @ViewChild('bianModal') private bianModal: ModalDirective;

  showbianImport() {
    this.bianModal.show();
  }

  hidebianImport() {
    this.bianModal.hide();
  }
  //bian = {};

  biansiImp(data) {
    console.log(data);
    if (this.produce['isv']) {
      this.toast.pop('warning', '加工单已经验收！！！');
      return '';
    }
    if (!data.isbm) {
      this.toast.pop('warning', '请选择基料的货物！！！');
      return '';
    }
    this.chanpin['bmid'] = data.id;
    this.showbianImport();
  }

  // 添加
  addBian() {
    if (!this.chanpin['typecode']) {
      this.toast.pop('warning', '请选择类别');
      return;
    }
    if (!this.chanpin['weight']) {
      this.toast.pop('warning', '请填写重量');
      return;
    }
    if (!this.chanpin['kunbaohao']) {
      this.toast.pop('warning', '请填写捆包号');
      return;
    }
    if (!this.chanpin['width']) {
      this.toast.pop('warning', '请填写宽度');
      return;
    }
    if (confirm('你确定添加吗？')) {
      this.produceApi.addBian(this.chanpin).then((data) => {
        // ngDialog.close();
        this.hidebianImport();
        this.toast.pop('success', '添加成功');
        // Notify.alert('添加成功', { status: 'success' });
        this.getProduce();
        this.getDetail();
      });
    }
  }

  // 验收
  checkAndruku() {
    this.produceApi.judge({ produceid: this.produce['id'] }).then((response) => {
      if (confirm('共需要验收' + response['tweight'] + '吨,' + response['msg'])) {
        if(!this.feelist.length){
            if (this.produce['producemode'] === 1) {
              this.produceApi.checkOEMFp({ produceid: this.produce['id'] }).then(() => {
                // Notify.alert('验收成功', { status: 'success' });
                this.toast.pop('success', '验收成功');
                // $state.go('app.producedet');
                this.router.navigateByUrl('producedet');
              });
            } else if (this.produce['producemode'] === 3) {
              if(confirm('未添加费用，你确定要验收吗？')){
                  this.produceApi.checkWeishiFp({ produceid: this.produce['id'] }).then(() => {
                    // Notify.alert('验收成功', { status: 'success' });
                    this.toast.pop('success', '验收成功');
                   // $state.go('app.producedet');
                   this.router.navigateByUrl('producedet');
                  });
              }
            } else {
              if(response['feemsg']){
                if(confirm(response['feemsg'])){
                  this.produceApi.checkFp({ produceid: this.produce['id'] }).then(() => {
                    // Notify.alert('验收成功', { status: 'success' });
                    this.toast.pop('success', '验收成功');
                    // $state.go('app.producedet');
                    this.router.navigateByUrl('producedet');
                  });
                }
              }else{
                this.produceApi.checkFp({ produceid: this.produce['id'] }).then(() => {
                  // Notify.alert('验收成功', { status: 'success' });
                  this.toast.pop('success', '验收成功');
                  // $state.go('app.producedet');
                  this.router.navigateByUrl('producedet');
                });
              }
            }
        }else{
          if (this.produce['producemode'] === 1) {
            this.produceApi.checkOEMFp({ produceid: this.produce['id'] }).then(() => {
              // Notify.alert('验收成功', { status: 'success' });
              this.toast.pop('success', '验收成功');
              // $state.go('app.producedet');
              this.router.navigateByUrl('producedet');
            });
          } else if (this.produce['producemode'] === 3) {
            this.produceApi.checkWeishiFp({ produceid: this.produce['id'] }).then(() => {
              // Notify.alert('验收成功', { status: 'success' });
              this.toast.pop('success', '验收成功');
              // $state.go('app.producedet');
              this.router.navigateByUrl('producedet');
            });
          } else {
            this.produceApi.checkFp({ produceid: this.produce['id'] }).then(() => {
              // Notify.alert('验收成功', { status: 'success' });
              this.toast.pop('success', '验收成功');
              // $state.go('app.producedet');
              this.router.navigateByUrl('producedet');
            });
          }
        }
      }
    });
  }

  // 撤销验收
  cancelCheck() {
    if (!this.produce['isv']) {
      this.toast.pop('warning', '未验收的加工单不允许撤销！');
      return '';
    }
    if (this.produce['producemode'] === 1) {
      this.produceApi.cancelOEMCheck(this.produce['id']).then(() => {
        this.toast.pop('success', '撤销成功，库存已经恢复');
        this.router.navigateByUrl('producedet');
      });
    } else if (this.produce['producemode'] === 3) {
      this.produceApi.cancelWeishiCheck(this.produce['id']).then(() => {
        this.toast.pop('success', '撤销成功，库存已经恢复');
        this.router.navigateByUrl('producedet');
      });
    } else {
      this.produceApi.cancelCheck(this.produce['id']).then(() => {
        this.toast.pop('success', '撤销成功，库存已经恢复');
        this.router.navigateByUrl('producedet');
      });
    }
  }

  @ViewChild('remainModal') private remainModal: ModalDirective;
  showremainImport() {
    this.remainModal.show();
  }

  hideremainImport() {
    this.remainModal.hide();
  }
  //验收单上传功能
  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;
  produceUploader() {
    this.uploaderModel.show();
  }
  // 入库单上传信息及格式
  uploadParam: any = { module: 'produce', count: 1, sizemax: 1, extensions: ['xls'] };

  // 设置上传的格式
  accept = ".xls, application/xls";

  // 上传成功执行的回调方法
  uploads($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      if (this.produce['producemode'] === 1) {
        this.produceApi.impOEMExcel(addData, this.produce['id']).then(data => {
          this.getDetail();
          this.toast.pop('success', '上传成功！');
          this.hideDialog();
        });
      } else if (this.produce['producemode'] === 3) {
        this.produceApi.impWEISHIExcel(addData, this.produce['id']).then(data => {
          this.getDetail();
          this.toast.pop('success', '上传成功！');
          this.hideDialog();
        });
      } else {
        this.produceApi.impExcel(addData, this.produce['id']).then(data => {
          this.getDetail();
          this.toast.pop('success', '上传成功！');
          this.hideDialog();
        });
      }

    }
  }

  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }
  // 加工单中费用添加仅限于邯郸维实的添加

  showproducefeedialog() {
    this.detids = new Array();
    const fproducts = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细。
    let weight = '0';
    for (let i = 0; i < fproducts.length; i++) {
      if (!fproducts[i].data.group && fproducts[i].selected) {
        this.toast.pop('warning', '请选择基料明细进行添加费用！');
        return;
      }
      if (fproducts[i].selected && fproducts[i].data.cangku) {
        weight = weight['add'](fproducts[i].data.weight);
        this.detids.push(fproducts[i].data.id);
      }
    }
    if (this.detids.length === 0) {
      this.toast.pop('warning', '请选择明细进行添加费用！');
      return;
    }
    this.producefee['weight'] = weight;
    this.producefeeModal.show();
  }
  // 卖方公司
  innercompany(event) {
    this.producefee['sellerid'] = event;
  }
  hideproducefeedialog() {
    this.producefeeModal.hide();
  }
  // 通过单价获取金额
  getjine() {
    if (!this.producefee['weight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    if (!this.producefee['price']) {
      this.toast.pop('warning', '请填写单价');
      return '';
    }
    if (Number(this.producefee['price']) < 0) {
      this.toast.pop('warning', '请正确填写单价');
      return '';
    }
    this.producefee['jine'] = Math.round(this.producefee['weight'].mul(this.producefee['price']) * 100) / 100;
  }
  // 通过金额获取单价
  getprice() {
    if (!this.producefee['weight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    if (!this.producefee['jine']) {
      this.toast.pop('warning', '请填写金额');
      return '';
    }
    this.producefee['price'] = Math.round(this.producefee['jine'].div(this.producefee['weight']) * 100) / 100;
  }
  // 通过单价获取金额
  getjine1() {
    if (!this.producefee2['price'] && this.producefee2['price']!=0) {
      this.toast.pop('warning', '请填写单价');
      return '';
    }
    if (Number(this.producefee2['price']) < 0) {
      this.toast.pop('warning', '请正确填写单价');
      return '';
    }
    this.producefee2['jine'] = Math.round(this.producefee2['weight'].mul(this.producefee2['price']) * 100) / 100;
  }
  // 通过金额获取单价
  getprice1() {
    if (!this.producefee2['jine']) {
      this.toast.pop('warning', '请填写金额');
      return '';
    }
    this.producefee2['price'] = Math.round(this.producefee2['jine'].div(this.producefee2['weight']) * 100) / 100;
  }
  createproduceFee() {
    if (!this.producefee['feetype']) {
      this.toast.pop('warning', '请选择费用类型！');
      return '';
    }
    if (!this.producefee['price']) {
      this.toast.pop('warning', '请填写单价!');
      return '';
    }
    if(!this.producefee['accountdirection']){
      this.toast.pop('warning', '请选择记账方向!');
      return '';
    }
    this.producefee['produceid'] = this.produce['id'];
    this.producefee['detids'] = this.detids;
    this.produceApi.createproducefee(this.producefee).then(data => {
      this.toast.pop('success', '添加成功！');
      this.listFeeDetail();
      this.hideproducefeedialog();
    });
  }
  modifypro: any = {};
  @ViewChild('modifyokModal') private modifyokModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;

  openmodify(params) {
    const obj = JSON.parse(JSON.stringify(params.data));
    this.producefee2 = {price:obj['price'],jine:obj['jine'],id:this.produce['id'],feecollectid:obj['group'],weight:obj['weight']};
    this.createModal.show();

  }
  modifyok() {
    this.produceApi.modifyok(this.producefee2).then(data => {
      this.createModal.hide();
      this.getDetail();
      this.listFeeDetail();
    });
  }
  hidemodifyokmodal() {
    this.modifyokModal.hide();
  }
  hidecreatemodal() {
    this.createModal.hide();
  }
  modify() {
    this.produceApi.modify(this.produce['id'], this.produce).then(data => {
      this.toast.pop('success', '更新成功！');
      this.listFeeDetail();
      this.hideproducefeedialog();
    });
  }
  //批量删除明细
  produceDetids: any = [];// 基料
  produceFpDetids: any = [];//成品
  removeDet() {
    this.produceDetids = new Array();
    this.produceFpDetids = new Array();
    const producedetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < producedetlist.length; i++) {
      if (producedetlist[i].selected && producedetlist[i].data) {
        if (producedetlist[i].data.isbm) this.produceDetids.push(producedetlist[i].data.id);
        else {
          console.log(producedetlist[i].data);
          this.produceFpDetids.push(producedetlist[i].data.fpid)
        }
      }
    }
    if (!this.produceDetids.length && !this.produceFpDetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (this.produceDetids.length) {
      console.log(this.produceDetids);
      if (confirm('你确定要删除基料吗？')) {
        this.produceApi.deleteDetList(this.produceDetids).then(data => {
          this.toast.pop('success', '删除成功！');
          this.getDetail();
        });
      }
    } else {
      console.log(this.produceFpDetids);
      if (confirm('你确定要删除成品吗？')) {
        this.produceApi.deleteFpDetList(this.produceFpDetids).then(data => {
          this.toast.pop('success', '删除成功！');
          this.getDetail();
        });
      }
    }
  }
  weishizhibao(){
    this.produceApi.reloadweishi(this.produce.id).then(data => {
      this.getDetail();
    });
  }
  //成品费用添加
  showFproductfeedialog() {
    this.detids = new Array();
    const fproducts = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细。
    let weight = '0';
    for (let i = 0; i < fproducts.length; i++) {
      if (fproducts[i].data.group && fproducts[i].selected) {
        this.toast.pop('warning', '请选择成品明细进行添加费用！');
        return;
      }
      if (fproducts[i].selected && !fproducts[i].data.cangku) {
        weight = weight['add'](fproducts[i].data.weight);
        this.detids.push(fproducts[i].data.fpid);
      }
    }
    if (this.detids.length === 0) {
      this.toast.pop('warning', '请选择明细进行添加费用！');
      return;
    }
    this.producefee['weight'] = weight;
    this.producefeeModal.show();
  }

  createFproduceFee() {
    if(!this.producefee['accountdirection']){
      this.toast.pop('warning', '请选择记账方向!');
      return '';
    }
    if(!this.producefee['sellerid']){
      this.toast.pop('warning', '请选择付费公司!');
      return '';
    }
    if (!this.producefee['feetype']) {
      this.toast.pop('warning', '请选择费用类型！');
      return '';
    }
    if (!this.producefee['price']) {
      this.toast.pop('warning', '请填写单价!');
      return '';
    }
    this.producefee['produceid'] = this.produce['id'];
    this.producefee['detids'] = this.detids;
    this.produceApi.createFproducefee(this.producefee).then(data => {
      this.toast.pop('success', '添加成功！');
      this.listFeeDetail();
      this.hideproducefeedialog();
    });
  }

}
