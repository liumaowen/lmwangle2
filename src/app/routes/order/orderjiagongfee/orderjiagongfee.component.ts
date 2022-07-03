import { ModalDirective } from 'ngx-bootstrap/modal';
import { OrderapiService } from './../orderapi.service';
import { ToasterService } from 'angular2-toaster';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-orderjiagongfee',
  templateUrl: './orderjiagongfee.component.html',
  styleUrls: ['./orderjiagongfee.component.scss']
})
export class OrderjiagongfeeComponent implements OnInit {

  msg = { msg: '', tweight: 0 };

  gridOptions: GridOptions;
  feeModel = { pprice: '', pjine: '' };
  array = [];
  transportType = [];
  companyOfYun;
  companyOfChuku;
  // 添加运费的弹出框
  @ViewChild('classicModal') private classicModal: ModalDirective;
  constructor(public settings: SettingsService, private toast: ToasterService, private orderApi: OrderapiService) {

    this.gridOptions = {
      rowData: null,
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressRowClickSelection: false,
      enableColResize: true,
      enableSorting: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      getContextMenuItems: this.settings.getContextMenuItems,
      onRowSelected: (params) => {
        if (params.node['selected']) {
          this.msg.tweight += parseFloat(params.node.data.weight);
          this.msg.tweight = this.msg.tweight;
        } else {
          this.msg.tweight -= parseFloat(params.node.data.weight);
          this.msg.tweight = this.msg.tweight;
        }
        this.msg.msg = '共选中了' + this.msg.tweight.toFixed(3) + '吨';
        // setInterval(function () {
        //   $scope.$apply(function () {
        //     $scope.msg.tweight;
        //     $scope.msg.msg;
        //   })
        // }, 10);
      },
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
      // gridReady: function (api) {
      //   api.onNewRows();
      // }
    };


    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true, pinned: 'left' },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单编号', field: 'billno', width: 100, pinned: 'left' },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'orderstatus', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 260 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'cangkuname', width: 100 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '目的地', field: 'destination', width: 200 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'contactman', width: 100 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '联系方式', field: 'contactway', width: 100 },

      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },

      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 100,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 110 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '出库费（元/吨）', field: 'perchukuprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '加工费总价（元/吨）', field: 'pjine', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '加工费单价（元/吨）', field: 'pprice', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工单位', field: 'pcustomername', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packtype', width: 74 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', width: 64 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否修边', field: 'isxiubian', width: 74 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工交期', field: 'jiaoqidate', width: 80 },
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
        cellStyle: { 'text-align': 'center' }, headerName: '分条规格', field: 'zjclaims', width: 150
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '横切规格', field: 'hqguige', width: 150
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '打包要求', field: 'yaoqiu', width: 200
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'pbeizhu', width: 100 },
    ];

    this.listDetail();
  }

  ngOnInit() {
  }

  // 网格赋值
  listDetail() {
    this.orderApi.orderentrucalclist().then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // 全部选择
  checkAll() {
    this.gridOptions.api.selectAll();
  }

  // 导出
  impyunfee() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '待核算运费明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }


  addyunfee() {
    const orderdetids = new Array(); // 定义一个数组存放订单明细表的id。
    const orderdets = this.gridOptions.api.getSelectedRows(); // 首先判断是否是选择的同一个仓库下的货物进行运费添加
    let cangkuid = null; let cangkucount = 0;
    if (orderdets.length === 0) {this.toast.pop('warning', '选择明细后再添加！'); return; }
    for (let i = 0; i < orderdets.length; i++) {
      if (cangkuid !== orderdets[i].cangkuid) {// 判断仓库是否相同
        cangkucount++; cangkuid = orderdets[i].cangkuid;
      }
      orderdetids.push(orderdets[i].orderdetid); // 将orderdetid放到数组中去
    }
    this.array = orderdetids;
    // this.orderApi.getchukufee({ detids: this.array }).then((response) => {
    //   this.feeModel['perchukuprice'] = response['perchukufee'];
    //   this.transportType = [{ label: '请选择运输类型', value: '' }, { label: '汽车运输', value: '汽车运输' },
    //    { label: '火车运输', value: '火车运输' }, { label: '轮船运输', value: '轮船运输' }]; // 定义运输类型
    // });
    this.open();
  }

  // 计算总加工费
  calcpjine() {
    if (this.feeModel['pprice']) {
      this.feeModel['pjine'] = (parseFloat(this.feeModel['pprice']) * parseFloat(String(this.msg['tweight']))).toFixed(2);
    }
  }

  // 计算加工费单价
  calcpprice() {
    if (this.feeModel['pjine']) {
      this.feeModel['pprice'] = (parseFloat(this.feeModel['pjine']) / parseFloat(String(this.msg['tweight']))).toFixed(2);
    }
  }

  // 重新填写
  selectNull() {
    this.feeModel = { pprice: '', pjine: '' };
    this.companyOfYun = null;
    this.companyOfChuku = null;
  }

  submitYunfee() {
    this.feeModel['array'] = this.array;
    if (typeof (this.companyOfYun) === 'string' || !this.companyOfYun) {
      this.toast.pop('warning', '填写有误，请选择加工单位');
      return;
    }
    if (!this.feeModel['pprice']) {
      this.toast.pop('warning', '填写有误，请输入加工费单价');
      return;
    }
    if (!this.feeModel['pjine']) {
      this.toast.pop('warning', '填写有误，请输入加工费总价');
      return;
    }
    this.feeModel['pcustomerid'] = this.companyOfYun['code'];
    this.orderApi.addproduceFee(this.feeModel).then((data) => {
      this.coles();
      this.toast.pop('success', '加工费添加成功，请提交订单以便客户及时付款');
      this.listDetail(); // 列表重新显示，刷新列表
      this.msg['tweight'] = 0;
    });
  }


  // 查询费用公司信息
  coles() {
    this.classicModal.hide();
  }

  open() {
    this.classicModal.show();
  }


  // 提交订单 运费都有了提交订单找人付款去
  saveandsubmit() {
    // 此处需要修改订单状态和结束时间
    const orderids = new Array(); // 定义一个数组存放订单明细表的id。
    const orderdets = this.gridOptions.api.getSelectedRows(); // 首先判断是否是选择的同一个仓库下的货物进行运费添加
    let id = null;
    console.log(orderdets);
    for (let i = 0; i < orderdets.length; i++) {
      if (parseInt(orderdets[i].peryunprice, 10) === 0) {
        this.toast.pop('warning', '所提交订单的运费单价不能为0');
        return;
      }
      if (id !== orderdets[i].orderid) {// 判断是否有多个订单提交
        orderids.push(orderdets[i].orderid); // 将orderid放到数组中去
        id = orderdets[i].orderid;
      }
    }
    const type = 1; // 1 加工费 2运费
    if (orderids.length === 1) {// 判断提交的订单中只有一个订单数
      if (confirm('在你提交订单前请确认该订单所有加工费都已录入！')) {
        this.orderApi.modifyorderstatus({ orderid: id, type: type }).then(() => {
          this.toast.pop('success', '提交订单成功，请耐心等待客户付款');
          this.listDetail(); // 列表重新显示，刷新列表
        });
      }
    } else {
      this.toast.pop('warning', '只能允许一次提交一个订单');
    }
  }

}
