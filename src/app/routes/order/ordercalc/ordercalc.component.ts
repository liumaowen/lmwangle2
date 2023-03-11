import { ModalDirective } from 'ngx-bootstrap/modal';
import { OrderapiService } from './../orderapi.service';
import { ToasterService } from 'angular2-toaster';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';

@Component({
  selector: 'app-ordercalc',
  templateUrl: './ordercalc.component.html',
  styleUrls: ['./ordercalc.component.scss']
})
export class OrdercalcComponent implements OnInit {
  msg = { msg: '', tweight: 0 };

  gridOptions: GridOptions;
  areamiddle={};
  provinces: any[] = [];
  citys: any[] = [];
  countys: any[] = [];

  constructor(
    public settings: SettingsService, 
    private toast: ToasterService, 
    private addressparseService: AddressparseService,
    private classifyApi: ClassifyApiService,
    private orderApi: OrderapiService,) {

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
    }


    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单编号', field: 'billno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'orderstatus', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 260 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'cangkuname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地', field: 'destination', width: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'contactman', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系方式', field: 'contactway', width: 100 },

      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },

      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 100,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 110 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '出库费（元/吨）', field: 'perchukuprice', width: 50,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '运费（元/吨）', field: 'peryunprice', width: 50,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'yuntype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的省', field: 'eprivince', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的市', field: 'ecity', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的县', field: 'ecountry', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 60,
        cellRenderer: data => {
          if (data.data) {
            return '<a target="_blank">修改</a>';
          } else {
            return '';
          }
        }, onCellClicked: (data) => {
          if (data.data) {
            this.showeditModal(data.data);
          }
        }
      },
    ];

    this.listDetail();
  }

  ngOnInit() {
  }

  destination;
  // 网格赋值
  listDetail() {
    this.orderApi.orderyunfeecalc().then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyApi.getChildrenTree({ pid: pid }).then((data) => {
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

  yunfeeModel:any = { perprice: '', tprice: '', transporttype: '' };

  array = [];

  transportType = [];
  wuliuyuanType = [];
  addyunfee() {
    let orderdetids = new Array(); // 定义一个数组存放订单明细表的id。
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
    // if (cangkucount === 1) {// 判断是不是只有一个仓库
    this.orderApi.getchukufee({ detids: this.array }).then((response) => {
      this.yunfeeModel['perchukuprice'] = response['perchukufee'];
      this.transportType = [{ label: '请选择运输类型', value: '' }, { label: '汽车运输', value: '汽车运输' }, { label: '火车运输', value: '火车运输' }, { label: '轮船运输', value: '轮船运输' }]; // 定义运输类型
      this.open();
    });

    // } else {
    //   this.toast.pop('warning', '请选择相同的仓库进行运费填写');
    // }
  }

  // 计算总运费
  calctprice() {
    if (this.yunfeeModel['peryunprice']) {
      this.yunfeeModel['tprice'] = (parseFloat(this.yunfeeModel['peryunprice']) * parseFloat(String(this.msg['tweight']))).toFixed(2);
    }
  }

  // 计算运费单价
  calcperprice() {
    if (this.yunfeeModel['tprice']) {
      this.yunfeeModel['peryunprice'] = (parseFloat(this.yunfeeModel['tprice']) / parseFloat(String(this.msg['tweight']))).toFixed(2);
    }
  }

  companyOfYun;
  companyOfChuku;
  // 重新填写
  selectNull() {
    this.yunfeeModel = { perprice: '', tprice: '', transporttype: '' };
    this.companyOfYun = null;
    this.companyOfChuku = null;
  }

  submitYunfee() {
    this.yunfeeModel['array'] = this.array;
    if (typeof (this.companyOfYun) === 'string' || !this.companyOfYun) {
      this.toast.pop('warning', '填写有误，请选择运输单位')
      return;
    }
    if (!this.companyOfChuku || typeof (this.companyOfChuku) === 'string') {
      this.toast.pop('warning', '请选择出库费费用单位');
      return;
    }
    if (!this.yunfeeModel['transporttype']) {
      this.toast.pop('warning', '请选择运输类型');
      return;
    }
    this.yunfeeModel['yunfeecustomerid'] = this.companyOfYun['code'];
    this.yunfeeModel['chukufeecustomerid'] = this.companyOfChuku['code'];
    console.log(this.yunfeeModel);
    this.orderApi.addorderdetyunfee(this.yunfeeModel).then((data) => {
      this.coles();
      this.toast.pop('success', '运费添加成功，请提交订单以便客户及时付款');
      this.listDetail(); // 列表重新显示，刷新列表
      this.msg['tweight'] = 0;
    });
  }


  // 添加运费的弹出框
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('editModal') private editModal: ModalDirective;
  hideeditModal(){
    this.editModal.hide();
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
      if (parseInt(orderdets[i].peryunprice) === 0) {
        // Notify.alert('所提交订单的运费单价不能为0', { status: 'warning' });
        this.toast.pop('warning', '所提交订单的运费单价不能为0');
        return;
      }
      if (id !== orderdets[i].orderid) {// 判断是否有多个订单提交
        orderids.push(orderdets[i].orderid); // 将orderid放到数组中去
        id = orderdets[i].orderid;
      }
    }
    const type = 2; // 1 加工费 2运费
    if (orderids.length === 1) {// 判断提交的订单中只有一个订单数
      if (confirm('在你提交订单前请确认该订单所有运费都已录入！')) {
        this.orderApi.modifyorderstatus({ orderid: id, type: type }).then(() => {
          // Notify.alert('提交订单成功，请耐心等待客户付款', { status: 'success' });
          this.toast.pop('success', '提交订单成功，请耐心等待客户付款');
          this.listDetail(); // 列表重新显示，刷新列表
        });
      }
    } else {
      // Notify.alert('只能允许一次提交一个订单', { status: 'warning' });
      this.toast.pop('warning', '只能允许一次提交一个订单');
    }
  }
  getProvince() {
    this.provinces = [];
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys = [];
      this.countys = [];
    });
  }
  getcity() {
    this.citys = [];
    delete this.areamiddle['cityid'];
    delete this.areamiddle['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.areamiddle['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }


  getcounty() {
    this.countys = [];
    delete this.areamiddle['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.areamiddle['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  showeditModal(params){
    this.editModal.show();
    this.getProvince();
    this.areamiddle['orderdetid'] = params.orderdetid;
  }
  save(){
    this.orderApi.update(this.areamiddle).then((data) => {
      this.listDetail();
    });
  }

}
