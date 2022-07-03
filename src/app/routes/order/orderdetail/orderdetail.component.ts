import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { GridOptions } from 'ag-grid';
import { BusinessorderapiService } from './../../businessorder/businessorderapi.service';
import { ActivatedRoute } from '@angular/router';
import { OrderapiService } from './../orderapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { JiagongmsgComponent } from '../jiagongmsg/jiagongmsg.component';
import { EditComponent } from '../edit/edit.component';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  // form: FormGroup;
  weight = null; // 单包重量
  guige = null; // 加工规格
  order = {};
  jiagongyaoqiu: any = {};
  flag = {};
  detlist = []; // 明细
  packtypes = [{ value: '裸包装', label: '裸包装' }, { value: '简包装', label: '简包装' },
   { value: '油纸包装', label: '油纸包装' }, { value: '精包装', label: '精包装' }];
  neijings = [{ value: '508', label: '508' }, { value: '610', label: '610' }];
  xiubians = [{ value: true, label: '是' }, { value: false, label: '否' }];
  gridOptions: GridOptions;
  basematerialImpbsModalRef: BsModalRef;
  constructor(public settings: SettingsService, private orderApi: OrderapiService,
    private route: ActivatedRoute, private businessorderApi: BusinessorderapiService,
     private toast: ToasterService, private router: Router,private datepipe: DatePipe,
     private bsModalService: BsModalService,
      // private fb: FormBuilder
      ) {
      // // 表单验证
      // this.form = fb.group({
      //   'weight': [null, Validators.compose([Validators.required,
      //   Validators.pattern('^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,3})?$')])],
      //   'guige': [null, []],
      //   'special': [null, []],
      //   'jiagongtype': [null, []],
      //   'packtype': [null, []],
      //   'jiaoqidate': [null, []]
      // });
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      getContextMenuItems: this.settings.getContextMenuItems,
      // 分组显示
      getNodeChildDetails: (rowItem) => {
        if (rowItem.group) {
          return {
            group: true,
            // expanded: rowItem.group === '彩涂' || rowItem.group === '镀锌' || rowItem.group === '镀铝锌',
            children: rowItem.participants,
            field: 'group',
            key: rowItem.group,
            expanded: true
          };
        } else {
          return null;
        }
      }, // 这个是获取孩子列表的
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'group', cellRenderer: 'group',
       width: 90, checkboxSelection: (params) => params.data.id, headerCheckboxSelection: true, },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 300 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'pertprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '出库费类型', field: 'chukufeetype', width: 110,
        cellRenderer: (params) => {
          if (params.data.chukufeetype == 0) {
            return '现结';
          } else if (params.data.chukufeetype == 1) {
            return '月结';
          } else if (params.data.chukufeetype == 2) {
            return '免付';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '出库费/吨', field: 'chukuprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '运费/吨', field: 'yunprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '加工费/吨', field: 'pprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '定价/吨', field: 'price', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      // {cellStyle : {"text-align":"center"},headerName : '差价',field : 'diffprice',width : 90},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 90,
        cellRenderer: (params) => {
          return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '加工类型', field: 'type', width: 90,
        cellRenderer: (params) => {
          if (params.data.type === 1) {
            return '纵剪';
          }else if (params.data.type === 2) {
            return '横切';
          } else if (params.data.type === 3) {
            return '纵剪+横切';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单包重量(吨)', field: 'singleweight', width: 95
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '分条规格', field: 'zjclaim', width: 150
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '横切规格', field: 'hqguige', width: 150
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '打包要求', field: 'yaoqiu', width: 200
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'pbeizhu', width: 100
      }
    ];

    this.getDetail();
  }


  ngOnInit() {
  }

  getDetail() {
    this.orderApi.get(this.route.params['value']['id']).then(data => {
      this.order = data['order'];
      if (this.order['status'] === 3) {
        this.flag['fin'] = true;
      } else {
        this.flag['fin'] = false;
      }
      if (!this.order['beizhu']) {this.flag['isbeizhu'] = true; } else {this.flag[''] = false; }
      if (this.order['producestatus'] === 1) {
        this.order['producestatus'] = '自行加工';
      } else if (this.order['producestatus'] === 2) {
        this.order['producestatus'] = '委托加工';
        if (this.order['isv']) {
          this.flag['showbutton'] = false;
        } else {
          this.flag['showbutton'] = true;
        }
      } else if (this.order['producestatus'] === 3) {
        this.order['producestatus'] = '不加工';
      }
    });

    this.businessorderApi.getdet(this.route.params['value']['id']).then(data => {
      this.gridOptions.api.setRowData(data);
      this.detlist = data[0]['participants'];
    });
  }


  // 查看已打印的订单
  print() {
    this.orderApi.print(this.route.params['value']['id']).then((response) => {
      console.log(response);
      if (!response['flag']) {
        this.toast.pop('warning', response['msg']);
      } else {
        window.open(response['msg']);
      }
    });
  }

  // 重新生成合同

  reload() {
    this.orderApi.reload(this.route.params['value']['id']).then((response) => {
      // Notify.alert(response.msg, { status: 'warning' });
      this.toast.pop('warning', response['msg']);
    });
  }

  // 业务员主动完成订单
  finish(id, version) {
    if (confirm('你确定要撤销合同吗?')) {
      this.businessorderApi.finish(id, { version: version }).then((data) => {
        console.log(data);
        if (data.json()) {
          this.toast.pop('success', '合同已撤销！');
          this.router.navigateByUrl('order');
        }
      });
    }
  }
  //自提改转货权修改
  modifytype() {
    this.orderApi.modifytype(this.order, this.order['id']).then(data => {
      this.toast.pop('success', '操作成功');
    })

  }
  // 保存修改
  save() {
    this.bsModalService.config.ignoreBackdropClick = true;
    this.basematerialImpbsModalRef = this.bsModalService.show(EditComponent);
    this.basematerialImpbsModalRef.content.parentthis = this;
  }
  /**提交审核 */
  submitVerify() {
    if (!this.order['packtype']) {this.toast.pop('warning', '请选择包装方式！'); return; }
    if (!this.order['neijing']) {this.toast.pop('warning', '请选择卷内径！'); return; }
    if (!this.order['jiaoqidate']) {this.toast.pop('warning', '请选择加工交期！'); return; }
    const isValuable = this.detlist.some(data => !data.type);
    if (isValuable) {this.toast.pop('warning', '请填写完加工要求！'); return; }
    if (confirm('你确定要提交给费用核算人员吗？')) {
      this.orderApi.noticeAccountant({orderid: this.order['id']}).then((data) => {
        this.router.navigateByUrl('order');
        this.toast.pop('success', '提交成功');
      });
    }
  }
  /**加工要求弹窗 */
  showjiagong() {
    const orderdetids = new Array(); // 定义一个数组存放订单明细表的id。
    const orderdets = this.gridOptions.api.getSelectedRows();
    for (let i = 0; i < orderdets.length; i++) {
      if (orderdets[i].id) {
        orderdetids.push(orderdets[i].id); // 将orderdetid放到数组中去
      }
    }
    if (orderdetids.length === 0) {this.toast.pop('warning', '选择明细后再添加！'); return; }
    this.jiagongyaoqiu = {};
    this.jiagongyaoqiu['orderdetids'] = orderdetids;
    this.jiagongyaoqiu['orderid'] = this.order['id'];
    this.bsModalService.config.ignoreBackdropClick = true;
    this.basematerialImpbsModalRef = this.bsModalService.show(JiagongmsgComponent);
    this.basematerialImpbsModalRef.content.parentthis = this;
  }
  closejiagong() {
    this.basematerialImpbsModalRef.hide();
    this.getDetail();
  }
  // /**关闭弹窗 */
  // coles() {
  //   this.jiagongModal.hide();
  //   this.defaultGroup1.active = [];
  //   this.defaultGroup2.active = [];
  // }
  // /**选中加工类型 */
  // selectetype(value) {
  //   this.jiagongyaoqiu['jiagongtype'] = value.text;
  // }
  // /**选中包装方式 */
  // selectepacktype(value) {
  //   this.jiagongyaoqiu['packtype'] = value.text;
  // }
}
