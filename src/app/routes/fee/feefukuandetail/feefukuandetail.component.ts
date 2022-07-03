import { FeeimplistComponent } from './../../../dnn/shared/feeimplist/feeimplist.component';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { GridOptions } from 'ag-grid/main';
import { FeefukuanapiService } from './../feefukuanapi.service';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from './../../../core/settings/settings.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { ReceiveapiService } from 'app/routes/receive/receiveapi.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feefukuandetail',
  templateUrl: './feefukuandetail.component.html',
  styleUrls: ['./feefukuandetail.component.scss']
})
export class FeefukuandetailComponent implements OnInit {
  isyunza:boolean = false;
  detaildata: any = []; // 明细
  pcode: number; // 审批阶段 制单：0 初步审核中：1 财务复核中：2 付款审核中：3
  companyIsWiskind = [];
  bankaccounts = [];
  params: any = {}; // 实际付款公司
  feefukuandettail: any = {};
  // 发票链接地址
  singleData = [];
  // 上传发票弹窗
  @ViewChild('invoiceModal') private invoiceModal: ModalDirective;
  // 发票链接地址
  @ViewChild('invoiceurlModel') private invoiceurlModel: ModalDirective;
  // 内部销售单的展示
  feefukuan = { feecustomer: {}, paycustomer: {}, feeorg: {}, payuser: {}, vuser: {}, feebank: {} };
  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');
  // 判断是否有仓储费
  ishavestoragefee: Boolean = false;
  bigjine;
  // 声明一个控制显示的对象
  flag = {
    cur: false, cangchu: false, verify: false, payuser: false, showPrint: false, pcheck: false,
    tiqianzhifu: false, curfapiao: false, paycheck: false
  };
  feeImpbsModalRef: BsModalRef;
  gridOptions: GridOptions;
  constructor(public settings: SettingsService, private storage: StorageService, private route: ActivatedRoute,
    private feefukuanApi: FeefukuanapiService, private toast: ToasterService, private router: Router,
    private bsModalService: BsModalService, private customerApi: CustomerapiService,
    private receiveApi: ReceiveapiService, private datepipe: DatePipe) {

    this.gridOptions = {
      rowData: null, // 行数据
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      // showToolPanel: true,
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true, // 焦点离开停止编辑
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    };
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', cellRenderer: 'group', width: 90, checkboxSelection: true, headerCheckboxSelection: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'feetype', width: 90,
        cellRenderer: (params) => {
          if (params.data.feetype === 1) {
            return '汽运费';
          } else if (params.data.feetype === 2) {
            return '铁运费';
          } else if (params.data.feetype === 3) {
            return '船运费';
          } else if (params.data.feetype === 4) {
            return '出库费';
          } else if (params.data.feetype === 5) {
            return '开平费';
          } else if (params.data.feetype === 6) {
            return '纵剪费';
          } else if (params.data.feetype === 7) {
            this.isyunza = true;
            return '销售运杂费';
          } else if (params.data.feetype === 8) {
            return '包装费';
          } else if (params.data.feetype === 9) {
            return '仓储费';
          } else if (params.data.feetype === 10) {
            return '保险费';
          } else if (params.data.feetype === 11) {
            return '付款公司汇总';
          } else {
            return '合计';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '总金额', field: 'jine', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已付金额', field: 'yijine', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '本次付金额', field: 'benjine', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerClass: 'text-red', headerName: '实付金额', field: 'shifujine', width: 90,
        valueFormatter: this.settings.valueFormatter2, editable: (params) => {
          if (this.flag.cur) {
            if (params.node.data.id) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        },
        onCellValueChanged: (params) => {
          // if (this.feefukuan['isv']) {
          //   this.toast.pop('warning', '已经审核不能修改了');
          //   return;
          // }
          if (this.flag.cur) {
            if (Number(params.newValue)) {
              const filterdata = this.detaildata.filter(item =>
                item.feeorgname === params.data['feeorgname'] &&
                item.paycustomername === params.data['paycustomername']
              );
              let sum: any = 0;
              filterdata.forEach(item => {
                sum += Number(item.benjine) || 0;
              });
              sum = this.toFixed(sum, 2);
              if (Number(params.newValue) > Number(sum)) {
                this.toast.pop('warning', '实付金额不得大于应付金额!');
                params.data.shifujine = params.oldValue;
                params.node.setData(params.node.data);
                return;
              }
            }
            this.feefukuanApi.modifyShifujine(this.feefukuan['id'], params.data.orgid, params.newValue, params.data.paycustomerid
            ).then((response) => {
              this.toast.pop('success', '修改成功');
              this.getFeefukuanAndDet();
            }, err => {
              params.data.shifujine = params.oldValue;
              params.node.setData(params.node.data);
            });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerClass: 'text-red', headerName: '税额', field: 'taxjine', width: 90,
        editable: (params) => {
          if (this.flag.verify) {
            if (params.node.data.taxjine) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        },
        onCellValueChanged: (params) => {
          this.feefukuanApi.updatetaxjine({ taxjine: params.newValue, paycustomerid: params.data.paycustomerid, feefukuanid: this.feefukuan['id'] }).then(data => {
            this.toast.pop('success', '修改成功');
            this.getFeefukuanAndDet();
          });
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '机构名称', field: 'feeorgname', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '付款单位', field: 'paycustomername', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '业务单位', field: 'yewudanwei', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'miaoshu', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '实际付款单位', field: 'actpcustomername', width: 90,
        cellRenderer: (params) => {
          if (this.flag.verify || this.flag.tiqianzhifu) {
            if (params.data.id) {
              return params.data.actpcustomername;
            } else {
              return '<a target="_blank">复核付款单位</a>';
            }
          } else {
            return params.data.actpcustomername;
          }
        },
        onCellClicked: (params) => {
          if (this.flag.verify || this.flag.tiqianzhifu) {
            this.feefukuandettail.orgid = params.data.orgid;
            this.feefukuandettail.paycustomerid = params.data.paycustomerid;
            this.showfuhedanweiVerify();
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '实际付款银行', field: 'paybname', width: 90,
        cellRenderer: (params) => {
          if (this.flag.payuser) {
            if (params.data.id) {
              return params.data.paybname;
            } else {
              return '<a target="_blank">实际付款银行</a>';
            }
          } else {
            return params.data.paybname;
          }
        },
        onCellClicked: (params) => {
          if (this.flag.payuser) {
            this.feefukuandettail.orgid = params.data.orgid;
            this.feefukuandettail.paycustomerid = params.data.paycustomerid;
            this.feefukuandettail.actpcustomerid = params.data.actpcustomerid;
            if (params.data.actpcustomerid) {
              this.getbank(params.data.actpcustomerid);
            }
            this.params['actpcustomerid'] = params.data.actpcustomerid;
            this.showfuhedanweiVerify();
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际付款账号', field: 'payaccount', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', width: 100,
        cellRenderer: (params) => {
          if (this.flag.cur) {
            if (params.data.id) {
              return '<a target="_blank">删除</a>';
            } else {
              return '';
            }
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (this.flag.cur) {
            if (params.data.id) {
              if (this.ishavestoragefee && this.feefukuan['vuserid'] == null) {
                if (confirm('你确定删除吗?')) {
                  this.feefukuanApi.removeDet(params.data.id).then((response) => {
                    this.toast.pop('success', '删除成功');
                    this.getFeefukuanAndDet();
                  });
                }
              } else if (!this.feefukuan['payuserid']) {
                if (confirm('你确定删除吗?')) {
                  this.feefukuanApi.removeDet(params.data.id).then((response) => {
                    this.toast.pop('success', '删除成功');
                    this.getFeefukuanAndDet();
                  });
                }
              }
            }
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', width: 90,
        cellRenderer: (params) => {
          //                		  console.log(params);
          return '<a target="_blank">' + params.data.billtype + '</a>';
        },
        onCellClicked: (params) => {
          if (params.data.billtype === '调拨单') {
            this.router.navigate(['allot', params.data.billid]);
          } else if (params.data.billtype === '提货单') {
            this.router.navigate(['tihuo', params.data.billid]);
          } else if (params.data.billtype === '销售退货单') {
            this.router.navigate(['xstuihuo', params.data.billid]);
          } else { }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据号', field: 'billno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 90 }
    ];

    this.getFeefukuanAndDet();
  }

  ngOnInit() {
    this.getMyRole();
  }
  // 获取网格中的数据

  getFeefukuanAndDet() {
    this.flag = {
      cur: false, cangchu: false, verify: false, payuser: false, showPrint: false, pcheck: false,
      tiqianzhifu: false, curfapiao: false, paycheck: false
    }; // 初始化
    this.feefukuanApi.getFeefukuanAndDet(this.route.params['value']['id']).then((response) => {
      this.feefukuan = response['feefukuan'];
      this.pcode = this.feefukuan['pcode'];
      this.ishavestoragefee = response['ishavestoragefee'];
      this.feefukuan['bigjine'] = response['bigjine'];
      if (this.feefukuan['cuserid'] === this.current['id'] && this.pcode === 0) { // 只有审核前才能引入费用
        this.flag.cur = true;
        this.flag.curfapiao = true;
      }
      if (this.feefukuan['fukuantype']) {
        this.flag.curfapiao = true;
      }
      if (this.feefukuan['vuserid'] === this.current.id && this.pcode === 1) {
        this.flag['cangchu'] = true;
      }
      if (this.feefukuan['pcheckuserid'] === this.current.id && this.pcode === 4) {
        this.flag.pcheck = true;
      }
      if (this.feefukuan['checkuserid'] === this.current.id && this.pcode === 2) {
        this.flag.verify = true;
      }
      if (this.feefukuan['pcheckuserid'] === this.current.id && this.pcode === 6) {
        this.flag.tiqianzhifu = true;
      }
      if (this.feefukuan['ischeck']) {
        this.flag['showPrint'] = true;
      }
      if (this.feefukuan['payuserid'] === this.current.id && this.pcode === 3 && !this.feefukuan['isv']) {
        this.flag.payuser = true;
      }
      if (this.feefukuan['payuserid2'] === this.current.id && this.pcode === 8) {
        this.flag.paycheck = true;
      }
      this.detaildata = response['detList'];
      this.gridOptions.api.setRowData(response['detList']);
    });
  }

  // 引入费用
  importFee() {
    // if (!this.feefukuan['feeorgid']) {
    //   this.toast.pop('warning', '费用机构为空不能引入！');
    //   // Notify.alert("费用机构为空不能引入！", { status: 'warning' });
    //   return;
    // }
    if (!this.feefukuan['feecustomerid']) {
      this.toast.pop('warning', '费用单位为空不能引入！');
      // Notify.alert("费用单位为空不能引入！", { status: 'warning' });
      return;
    }
    this.bsModalService.config.class = 'modal-all';
    this.feeImpbsModalRef = this.bsModalService.show(FeeimplistComponent);
    this.feeImpbsModalRef.content.parentThis = this;
  }

  jiesuantypes = [];
  // 添加审核人和费用付款审核人
  addvuserdialog() {
    if (!this.feefukuan['actrcustomername']) {
      this.toast.pop('warning', '请填写实际收款单位！');
      return;
    }
    if (!this.feefukuan['actrbname']) {
      this.toast.pop('warning', '请填写实际收款银行！');
      return;
    }
    if (!this.feefukuan['actraccount']) {
      this.toast.pop('warning', '请填写实际收款账号！');
      return;
    }
    if (this.detaildata.length) {
      const shifujines = [];
      this.detaildata.forEach(element => {
        if (element.billtype === '') {
          shifujines.push(element.shifujine);
        }
      });
      const istrue = shifujines.some(item => Number(item) === NaN || Number(item) === 0);
      if (istrue) {
        this.toast.pop('warning', '实付金额请填写完全！');
      } else {
        if (!this.ishavestoragefee) {
          this.feefukuanApi.cuserConfirm({ id: this.feefukuan['id'], vuserid: this.feefukuan['cuserid'] }).then((data) => {
            this.toast.pop('success', '提交成功,请等待审核。');
            this.getFeefukuanAndDet();
          });
        } else {
          if (this.feefukuan['isv']) {
            this.toast.pop('warning', '单据已经审核！');
            return;
          }
          this.showclassicModal();
        }
      }
    } else {
      this.toast.pop('warning', '费用明细为空不能提交！');
    }
  }
  // 查询用户对象
  suser;
  //提交给审核人
  submitVuser() {
    if (typeof (this.suser) === 'object') {
      this.feefukuanApi.cuserConfirm({ id: this.feefukuan['id'], vuserid: this.suser['code'] }).then((data) => {
        this.hideclassicModal();
        this.toast.pop('success', '提交成功,请等待审核。');
        this.getFeefukuanAndDet();
      });
    } else {
      this.toast.pop('warning', '请选择审核人！！！');
      return;
    }
  }

  // 取消付款人
  cancelpayuser() {
    if (!this.feefukuan['payuserid']) {
      this.toast.pop('warning', '付款人不存在不允许该操作。');
      // Notify.alert('付款人不存在不允许该操作。', { status: 'warning' });
      return;
    }
    if (confirm('你确定要取消付款人吗？')) {
      this.feefukuanApi.cancelPayuser(this.feefukuan['id']).then((response) => {
        this.toast.pop('success', '取消成功。');
        // Notify.alert('取消成功。', { status: 'success' });
        this.getFeefukuanAndDet();
      });
    }
  }

  // // 通知财务人员进行付款审核
  // submitFinance() {
  //   // if (!$scope.suser.selected) {
  //   //   Notify.alert('请选择财务人员！！！', { status: 'warning' });
  //   //   return;
  //   // }
  //   if (typeof (this.suser) === 'object') {
  //     this.feefukuanApi.submitFinance({ id: this.feefukuan['id'], fuserid: this.suser['code'] }).then(() => {
  //       // ngDialog.close();
  //       this.hideclassicModal();
  //       this.toast.pop('success', '提交成功,请等待审核。');
  //       this.router.navigateByUrl('feefukuan');
  //       // Notify.alert('提交成功,请等待审核。', { status: 'success' });
  //       // $state.go('app.feefukuan');
  //     });
  //   } else {
  //     this.toast.pop('warning', '请选择财务人员！！！');
  //     return;
  //   }
  // }

  // 通知财务人员进行付款审核
  submitFinance() {
    this.feefukuanApi.submitFinance({ id: this.feefukuan['id'] }).then(() => {
      this.hideclassicModal();
      this.toast.pop('success', '提交成功,请等待审核。');
      this.getFeefukuanAndDet();
    });
  }

  feeFuKuan() {
    this.feeImpbsModalRef.hide();
    this.getFeefukuanAndDet();
  }

  // 审核之后费用放弃审核
  giveUpAudit() {
    if (!this.feefukuan['isv']) {
      this.toast.pop('warning', '单据还没有审核不允许弃审！');
      return;
    }
    if (confirm('你确定放弃审核？')) {
      this.feefukuanApi.giveUpAudit(this.feefukuan['id']).then(() => {
        this.toast.pop('success', '放弃审核成功');
        this.getFeefukuanAndDet();
      });
    }
  }

  // 修改备注
  modifyinfo() {
    if (this.pcode === 0) {
      this.feefukuanApi.modifyinfo(this.feefukuan['id'], {
        beizhu: this.feefukuan['beizhu'],
        fapiaohao: this.feefukuan['fapiaohao']
      }).then(() => {
        this.toast.pop('success', '修改成功');
      });
    }
  }

  // 打印预览
  print() {
    this.feefukuanApi.print(this.route.params['value']['id']).then((response) => {
      if (!response['flag']) {
        this.toast.pop('warning', response['msg']);
      } else {
        window.open(response['msg']);
      }
    });
  };

  // 重新打印预览
  reload() {
    this.feefukuanApi.reload(this.route.params['value']['id']).then((response) => {
      this.toast.pop('warning', response['msg']);
    });
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  @ViewChild('feeVerify') private feeVerify: ModalDirective;

  showfeeVerify() {
    if (this.feefukuan['actpcustomerid']) {
      this.getbank(this.feefukuan['actpcustomerid']);
    }
    this.feeVerify.show();
  }

  hidefeeVerify() {
    this.feeVerify.hide();
    this.params = {};
  }
  /**银行账户 */
  getbank(receivecustomerid) {
    this.receiveApi.findbycustomerid(receivecustomerid).then((data) => {
      const lslists = [{ label: '请选择收款银行', value: '' }];
      data.forEach(element => {
        lslists.push({
          label: element.bank,
          value: element.id
        });
      });
      this.bankaccounts = lslists;
    });
  }
  /**获取内部公司 */
  findWiskind() {
    this.customerApi.findwiskind().then((response) => {
      const paycustomerlists = [{ label: '请选择', value: '' }];
      for (let i = 1; i < response.length; i++) {
        if (response[i].id === 3453) {
          response.splice(i, 1);
        }
      }
      response.forEach(element => {
        paycustomerlists.push({
          label: element.name,
          value: element.id
        });
      });
      this.companyIsWiskind = paycustomerlists;
    });
  }
  // 收款银行都有了银行卡号也要有啊!出来吧银行卡号！！！
  getcardno(paybankid) {
    this.receiveApi.getfukuanaccount(paybankid).then((data) => {
      this.params['payaccount'] = data['fukuanaccount'];
    });
  }
  /**添加实际公司信息 */
  realcompany() {
    this.params = {};
    this.params['actpcustomerid'] = this.feefukuan['paycustomerid'];
    this.jiesuantypes = [{ label: '请选择结算方式', value: '' }, { label: '现金', value: '1' },
    { label: '电汇', value: '2' }, { label: '承兑', value: '3' }, { label: '转账', value: '4' },
    { label: '处理余额', value: '5' }];
    if (this.params['isv']) {
      this.toast.pop('warning', '单据已经付款！');
      return;
    }
    this.findWiskind();
    if (this.params['actpcustomerid']) {
      this.getbank(this.params['actpcustomerid']);
    }
    if (this.feefukuan['jiesuantype']) {
      this.params['jiesuantype'] = this.feefukuan['jiesuantype'] + '';
      this.params['taxrate'] = this.feefukuan['taxrate'];
      this.params['notaxjine'] = this.feefukuan['notaxjine'];
      this.params['taxjine'] = this.feefukuan['taxjine'];
      this.params['actpcustomerid'] = this.feefukuan['actpcustomerid'];
      this.params['paybankid'] = this.feefukuan['paybankid'];
      this.params['payaccount'] = this.feefukuan['payaccount'];
      if (this.params['actpcustomerid']) {
        this.getbank(this.params['actpcustomerid']);
      }
    }
    this.showfeeVerify();
  }

  /** 提前支付方式 */
  tiqianzhifu() {

  }
  /**
   * 计算不含税金额
   * 不含税金额=本次实付金额/（1+税率）
   */
  getnotaxjine() {
    if (this.params['taxrate']) {
      console.log(1111111111);
      this.params['notaxjine'] = Math.round(this.feefukuan['tshifujine'].div(1 + this.params['taxrate'] / 100) * 100) / 100;
      this.params['notaxjine'] = this.params['notaxjine'].fmoney(2, 0);
      this.gettaxjine();
    }
  }
  /**
   * 计算税额
   * 税额=本次实付金额-不含税金额
   */
  gettaxjine() {
    if (this.params['notaxjine']) {
      this.params['taxjine'] = Math.round(this.feefukuan['tshifujine'].sub(this.params['notaxjine']) * 100) / 100;
      this.params['taxjine'] = this.params['taxjine'].fmoney(2, 0);
    }
  }
  /**重置 */
  reset() {
    this.params = {};
  }
  /**修改 */
  modifyzhubiao() {
    let paramsdata = {};
    if (this.flag['verify']) {
      if (!this.params['jiesuantype']) {
        this.toast.pop('warning', '请选择结算方式！');
        return;
      }
      if (this.params['taxrate'] === '' || this.params['taxrate'] === null || this.params['taxrate'] === undefined) {
        this.toast.pop('warning', '请选择税率！');
        return;
      }
      if (this.params['notaxjine'] === '' || this.params['notaxjine'] === null || this.params['notaxjine'] === undefined) {
        this.toast.pop('warning', '请选择不含税金额！');
        return;
      }
      if (this.params['taxjine'] === '' || this.params['taxjine'] === null || this.params['taxjine'] === undefined) {
        this.toast.pop('warning', '请选择税额！');
        return;
      }
      // if (!this.params['actpcustomerid']) {
      //   this.toast.pop('warning', '请选择实际付款单位！');
      //   return;
      // }
      paramsdata = {
        jiesuantype: this.params['jiesuantype'], taxrate: this.params['taxrate'],
        notaxjine: this.params['notaxjine'], taxjine: this.params['taxjine'], actpcustomerid: this.params['actpcustomerid']
      };
    }
    if (this.flag.payuser) {
      if (!this.params['paybankid']) {
        this.toast.pop('warning', '请选择实际付款银行！');
        return;
      }
      if (!this.params['payaccount']) {
        this.toast.pop('warning', '请选择实际付款账号！');
        return;
      }
      paramsdata = { paybankid: this.params['paybankid'], payaccount: this.params['payaccount'] };
    }
    if (this.flag.tiqianzhifu) {
      if (!this.params['jiesuantype']) {
        this.toast.pop('warning', '请选择结算方式！');
        return;
      }
      paramsdata = {
        jiesuantype: this.params['jiesuantype']
      };
    }
    this.feefukuanApi.modifyinfo(this.feefukuan['id'], paramsdata).then(() => {
      this.toast.pop('success', '保存成功');
      this.getFeefukuanAndDet();
      this.hidefeeVerify();
    });
  }
  /**实际收款公司银行 */
  modifyshiji() {
    if (this.pcode === 0 || this.pcode === 7) {
      this.feefukuanApi.modifyinfo(this.feefukuan['id'], {
        actrcustomername: this.feefukuan['actrcustomername'],
        actrbname: this.feefukuan['actrbname'],
        actraccount: this.feefukuan['actraccount'],
        beizhu: this.feefukuan['beizhu'],
        fapiaohao: this.feefukuan['fapiaohao']
      }).then(() => {
        this.toast.pop('success', '修改成功');
        this.getFeefukuanAndDet();
      });
    }
  }
  /**审批 */
  agreeAndDisagree(flag, params) {
    const msg = params ? '同意' : '弃审';
    switch (flag) {
      case 1:
        if (confirm(`你确定要${msg}吗？`)) {
          this.feefukuanApi.submitStorage({ id: this.feefukuan['id'], isvcc: params }).then(() => {
            this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
            this.getFeefukuanAndDet();
          });
        }
        break;
      case 4:
        if (params) {
          if (confirm(`你确定要${msg}吗？`)) {
            this.feefukuanApi.pcheck({ id: this.feefukuan['id'], ispcheck: params }).then(() => {
              this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
              this.getFeefukuanAndDet();
            });
          }
        } else {
          if (confirm(`你确定要${msg}吗？`)) {
            this.feefukuanApi.pcheck({ id: this.feefukuan['id'], ispcheck: params }).then(() => {
              this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
              this.getFeefukuanAndDet();
            });
          }
        }
        break;
      case 2:
        if (params) {
          if (this.feefukuan['jiesuantype']) {
            if (confirm(`你确定要${msg}吗？`)) {
              this.feefukuanApi.submitCheck({ id: this.feefukuan['id'], ischeck: params }).then(() => {
                this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
                this.getFeefukuanAndDet();
              });
            }
          } else {
            this.toast.pop('warning', '请完善复核信息！');
          }
        } else {
          if (confirm(`你确定要${msg}吗？`)) {
            this.feefukuanApi.submitCheck({ id: this.feefukuan['id'], ischeck: params }).then(() => {
              this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
              this.getFeefukuanAndDet();
            });
          }
        }
        break;
      case 3:
        if (params) {
          // if (this.feefukuan['paybankid']) {
          if (confirm(`你确定要${msg}吗？`)) {
            this.feefukuanApi.submitFukuan({ id: this.feefukuan['id'], isv: params }).then(() => {
              this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
              this.getFeefukuanAndDet();
            });
          }
          // } else {
          //   this.toast.pop('warning', '请完善付款银行！');
          // }
        } else {
          if (confirm(`你确定要${msg}吗？`)) {
            this.feefukuanApi.submitFukuan({ id: this.feefukuan['id'], isv: params }).then(() => {
              this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
              this.getFeefukuanAndDet();
            });
          }
        }
        break;
      case 6:
        if (params) {
          if (this.feefukuan['jiesuantype']) {
            if (confirm(`你确定要${msg}吗？`)) {
              this.feefukuanApi.submitCheck({ id: this.feefukuan['id'], ischeck: params }).then(() => {
                this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
                this.getFeefukuanAndDet();
              });
            }
          } else {
            this.toast.pop('warning', '请完善提前支付信息！');
          }
        } else {
          if (confirm(`你确定要${msg}吗？`)) {
            this.feefukuanApi.submitCheck({ id: this.feefukuan['id'], ischeck: params }).then(() => {
              this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
              this.getFeefukuanAndDet();
            });
          }
        }
        break;
      case 8:
        if (params) {
          if (confirm(`你确定要${msg}吗？`)) {
            this.feefukuanApi.submitpay({ id: this.feefukuan['id'], ischeck: params }).then(() => {
              this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
              this.getFeefukuanAndDet();
            });
          }
        } else {
          if (confirm(`你确定要${msg}吗？`)) {
            this.feefukuanApi.submitpay({ id: this.feefukuan['id'], ischeck: params }).then(() => {
              this.toast.pop('success', (params ? '审核' : '弃审') + '成功');
              this.getFeefukuanAndDet();
            });
          }
        }
        break;
      default:
        break;
    }
  }
  /**
   * 保留小数位数
   * @param num 表示需要四舍五入的小数
   * @param s 表示需要保留几位小数
   */
  toFixed(num: any, s: any) {
    const times = Math.pow(10, s);
    if (num < 0) {
      num = Math.abs(num); // 先把负数转为正数，然后四舍五入之后再转为负数
      const numstring: any = num * times + 0.5;
      const des = parseInt(numstring, 10) / times;
      return -des;
    } else {
      const numstring: any = num * times + 0.5;
      const des = parseInt(numstring, 10) / times;
      return des;
    }
  }

  // 打开上传发票弹窗
  showUploadInvoice() {
    console.log(this.current);
    if (!this.feefukuan['fukuantype']) {
      if (this.feefukuan['pcode'] !== 0 && this.feefukuan['pcode'] !== 7) {
        this.toast.pop('warning', '只有制单中的费用付款单才可以上传发票！！！');
        return;
      }
      if (this.feefukuan['cuserid'] !== this.current.id) {
        this.toast.pop('warning', '只有制单人才可以上传发票！！！');
        return;
      }
    }
    this.invoiceModal.show();
  }
  //提交发票审核
  submitfapiao() {
    if (confirm(`你确定要进行发票审核吗？`)) {
      this.feefukuanApi.pcheck({ id: this.feefukuan['id'], ispcheck: true }).then(() => {
        this.toast.pop('success', '审核成功');
        this.getFeefukuanAndDet();
      });
    } else {
      return;
    }
  }

  // 关闭上传发票弹窗
  hideInvoiceModal() {
    this.invoiceModal.hide();
  }
  //上传合同
  uploadParam = {
    module: 'invoice', count: 1, sizemax: 10,
    extensions: ['tiff', 'pdf', 'jpeg', 'jpg', 'png']
  };

  //设置上传文件类型
  accept = '.jpeg, image/jpeg, application/pdf, image/tiff, image/jpg, image/png';

  //点击上传执行的回调函数
  uploads($event) {
    let addData = {
      url: [$event.url], extensions: this.uploadParam.extensions,
      id: this.feefukuan['id']
    };
    if ($event.length !== 0) {
      this.feefukuanApi.uploadinvoice(addData).then(data => {
      });
    }
    this.hideInvoiceModal();
  }

  // 查询对应的期货物流竞价
  getInvoiveUrl() {
    this.feefukuanApi.getInvoiveUrl(this.feefukuan['id']).then(data => {
      this.singleData = data;
      if (!this.singleData || !this.singleData.length) {
        this.toast.pop('warning', '未查询到发票！！！');
        return;
      }
      this.invoiceurlModel.show();
    })
  }
  hideInvoiceurlModel() {
    this.invoiceurlModel.hide();
  }
  deleteInvoice(filename) {
    let params = {};
    params = { id: this.feefukuan['id'], filename: filename }
    console.log(params);
    this.feefukuanApi.deleteInvoice(params).then(data => {
      if (data) {
        this.hideInvoiceurlModel();
      }
    });
  }
  @ViewChild('fuhedanweiVerify') private fuhedanweiVerify: ModalDirective;

  showfuhedanweiVerify() {
    this.findWiskind();
    if (this.params['actpcustomerid']) {
      this.getbank(this.params['actpcustomerid']);
    }
    this.fuhedanweiVerify.show();
  }

  hidefuhedanweiVerify() {
    this.fuhedanweiVerify.hide();
    this.params = {};
  }

  modifydetbank() {
    let paramsdata = {};
    if (this.flag.payuser) {
      if (!this.params['paybankid']) {
        this.toast.pop('warning', '请选择实际付款银行！');
        return;
      }
      if (!this.params['payaccount']) {
        this.toast.pop('warning', '请选择实际付款账号！');
        return;
      }
    }
    console.log(this.params['actpcustomerid']);
    paramsdata = {
      actpcustomerid: this.feefukuandettail.actpcustomerid ? this.feefukuandettail.actpcustomerid : this.params['actpcustomerid'],
      paybankid: this.params['paybankid'], payaccount: this.params['payaccount'],
      paycustomerid: this.feefukuandettail.paycustomerid, orgid: this.feefukuandettail.orgid
    };
    this.feefukuanApi.modifydetinfo(this.feefukuan['id'], paramsdata).then(() => {
      this.toast.pop('success', '保存成功');
      this.getFeefukuanAndDet();
      this.hidefuhedanweiVerify();
      this.feefukuandettail = {};
    });
  }
  caiwuyunying = false;
  getMyRole() {
    let myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      if (myrole[i] === 5 || myrole[i] === 6 || myrole[i] === 7 || myrole[i] === 11 || myrole[i] === 13 || myrole[i] === 19) {
        this.caiwuyunying = true;
      }
    }
  }
  //批量删除明细
  feefukuandetids: any = [];
  deleteFeefukuanDet() {
    this.feefukuandetids = new Array();
    const feefukuandetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < feefukuandetlist.length; i++) {
      if (feefukuandetlist[i].selected && feefukuandetlist[i].data && feefukuandetlist[i].data['id']) {
        this.feefukuandetids.push(feefukuandetlist[i].data.id);
      }
    }
    if (!this.feefukuandetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.feefukuanApi.deleteFeefuandet(this.feefukuandetids).then(data => {
        this.toast.pop('success', '删除成功！');
        this.getFeefukuanAndDet();
      });
    }
  }
}
