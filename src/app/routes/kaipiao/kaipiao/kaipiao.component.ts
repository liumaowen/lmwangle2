import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { OrderapiService } from './../../order/orderapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
const sweetalert = require('sweetalert');
@Component({
  selector: 'app-kaipiao',
  templateUrl: './kaipiao.component.html',
  styleUrls: ['./kaipiao.component.scss']
})
export class KaipiaoComponent implements OnInit {
  @ViewChild('addrModal') private addrModal: ModalDirective;
  kaipiao_sum = '0';
  kaipiao_tweight = '0';
  querys = {};
  billgns = []; // 多个品名的数组
  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');

  gridOptions: GridOptions;

  // 买方单位
  buyer;

  // 我要开票
  params = {};

  gnids;

  maifangids;

  tihuodetids;

  xstuihuodetids;

  xsbuchadetids;

  advanceinvoicedetids;

  sellerids;

  pid;

  isonlines;

  gnlist;

  types;
  expresses = [];
  addrs = [];
  addr = {};
  provinces = [];
  citys = [];
  countys = [];

  constructor(public settings: SettingsService,
    private storage: StorageService,
    private orderApi: OrderapiService,
    private toast: ToasterService,
    private classifyApi: ClassifyApiService) {

    this.gridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      suppressRowClickSelection: false,
      enableColResize: true,
      enableSorting: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      getContextMenuItems: this.settings.getContextMenuItems,
      onRowSelected: (event) => {
        this.datawidth();
      },
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'orderbill', width: 100 ,
        cellRenderer: function (params) {
          if (params.data) {
            if (params.data.orderbill.substring(0, 2) === 'QH') {
              return '<a target="_blank" href="#/qihuo/' + params.data.orderbillid + '">' + params.data.orderbill + '</a>';
            } else if (params.data.orderbill.substring(0, 2) === 'BO') {
              return '<a target="_blank" href="#/businessorder/' + params.data.orderbillid + '">' + params.data.orderbill + '</a>';
            } else {
              return '<a target="_blank" href="#/order/' + params.data.orderbillid + '">' + params.data.orderbill + '</a>';
            }
          } 
        }
    },
      {cellStyle: { 'text-align': 'center' }, headerName: '是否上传客户红章合同', field: 'isgaizhang', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'maifangname', width: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'seller', width: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'wguige', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', width: 60 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'pertprice', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'tjine', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'saleman', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'stdate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售时间', field: 'saledate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提单号', field: 'thbillno', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '新单位名称', field: 'unitname', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '新单位数量', field: 'unitweight', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '新单位价格', field: 'unitprice', width: 150 }
    ];

    this.kaipiaoList();
  }

  ngOnInit() {
  }

  datawidth() {
    let list = [];
    list = this.gridOptions.api.getSelectedNodes();
    let tjine = 0;
    let tweight = 0;
    for (let i = 0; i < list.length; i++) {
      tjine = tjine['add'](list[i].data.tjine);
      tweight = tweight['add'](list[i].data.weight);
    }
    this.kaipiao_sum = tjine.toString();
    this.kaipiao_tweight = tweight.toString();
  }

  kaipiaoList() {
    this.orderApi.querykaipiao({ isonline: false }).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // 启动查询对话框
  queryDialog() {
    this.selectNull();
    this.querys['isonline'] = 'false';
    this.showclassicModal();
  }

  selectNull() {
    this.querys = {};
    this.buyer = undefined;
  }

  query() {
    if (typeof (this.buyer) === 'object') {
      this.querys['customerid'] = this.buyer['code'];
      console.log('kaipiaosss', this.buyer['code']);
    } else {
      this.querys['customerid'] = '';
    }
    this.orderApi.querykaipiao(this.querys).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
    this.hideclassicModal();
  }
  findAddr() {
    const search = { buyerid: this.maifangids[0], ismailaddr: true };
    const arry = [{ label: '取消', value: '' }];
    this.orderApi.listAddresses(search).then((data) => {
      for (let i = 0; i < data.length; i++) {
        const address = {
          value: data[i].id, label: data[i].province + data[i].city + data[i].county
            + data[i].detail + '---' + data[i].lianxiren + data[i].phone
        };
        arry.push(address);
      }
      this.addrs = arry;
    });
  }

  kaipiaoDialog() {
    this.params = {};
    // this.gnids = [];
    this.billgns = [];
    this.maifangids = [];
    this.tihuodetids = [];
    this.xstuihuodetids = [];
    this.xsbuchadetids = [];
    this.advanceinvoicedetids = [];
    this.sellerids = [];
    const dets = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细。
    const gns = [];

    if (dets.length > 0) {
      for (let i = 0; i < dets.length; i++) {
        if (dets[i].selected) {
          if (dets[i].data.type === 1) { // 提单明细
            this.tihuodetids.push(dets[i].data.billid);
          } else if (dets[i].data.type === 2) { // 退货单明细
            this.xstuihuodetids.push(dets[i].data.billid);
          } else if (dets[i].data.type === 3) { // 补差单明细
            this.xsbuchadetids.push(dets[i].data.billid);
          } else if (dets[i].data.type === 4) {
            this.advanceinvoicedetids.push(dets[i].data.billid);
          }

          // if (this.gnids.indexOf(dets[i].data.gnid) === -1) {
          //   this.gnids.push(dets[i].data.gnid);
          // }
          gns.push({ gnname: dets[i].data.gn });
          if (this.maifangids.indexOf(dets[i].data.buyerid) === -1) {
            this.maifangids.push(dets[i].data.buyerid);
          }
          if (this.sellerids.indexOf(dets[i].data.sellerid) === -1) {
            this.sellerids.push(dets[i].data.sellerid);
          }
        }
      }
      console.log(gns);
      this.billgns = this.unique(JSON.parse(JSON.stringify(gns)));
      this.billgns.forEach(billgn => {
        this.classifyApi.getsalebill({ pid: billgn.gnname }).then((data) => {
          billgn['gnlists'] = [];
          data.forEach(element => {
            billgn['gnlists'].push({
              label: element['label'],
              value: element['label']
            });
          });
          billgn['gn'] = billgn['gnlists'][0].value;
        });
      });
      if (this.tihuodetids.length < 1 && this.xstuihuodetids.length < 1 &&
        this.xsbuchadetids.length < 1 && this.advanceinvoicedetids.length < 1) {
        this.toast.pop('warning', '请选择要开票的货物！！！');
        return '';
      }
      if ((this.tihuodetids.length > 0) && (this.xstuihuodetids.length > 0)) {
        this.toast.pop('warning', '销售退货货物不允许与普通货物一起开票！！！');
        return '';
      }
      // if (this.gnids.length > 100) {
      // this.toast.pop('warning', '请选择相同品名的货物进行开票！！！');
      // } else {
      if (this.maifangids.length > 1) {
        this.toast.pop('warning', '请选择相同客户的货物进行开票！！！');
      } else {
        if (this.sellerids.length > 1) {
          this.toast.pop('warning', '请选择相同卖方单位的货物进行开票！！！');
        } else {
          this.params['tihuodetids'] = this.tihuodetids;
          this.params['xstuihuodetids'] = this.xstuihuodetids;
          this.params['xsbuchadetids'] = this.xsbuchadetids;
          this.params['advanceinvoicedetids'] = this.advanceinvoicedetids;
          // this.pid = Number(this.gnids[0]) + 3932;
          // this.pid = this.gnids[0];
          // console.log('$scope.pid', this.gnids[0]);
          // this.classifyApi.getChildrenTree({ pid: this.pid }).then((data) => {
          // this.classifyApi.getsalebill({ pid: this.pid }).then((data) => {
          //   const gnlists = [{ value: '', label: '请选择发票品名' }];
          //   data.forEach(element => {
          //     gnlists.push({
          //       label: element['label'],
          //       value: element['label']
          //     });
          //   });
          //   this.gnlist = gnlists;
          // });
          this.isonlines = [{ value: '', label: '请选择客户类型' }, { value: true, label: '线上客户' }, { value: false, label: '线下客户' }];
          this.types = [{ value: '', label: '请选择发票类型' }, { value: '0', label: '增值税（普通）' }, { value: '1', label: '增值税（专用）' },{value: '2', label: '电子增值税专用发票'},{value: '3', label: '普通电子发票'}];
          this.orderApi.gethuandan(this.maifangids[0]).then(huandans => {
            if (this.advanceinvoicedetids.length !== huandans.length) {
              sweetalert({
                title: '你确定开票吗？',
                text: '客户还有未还单明细',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#23b7e5',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: false
              }, () => {
                this.classifyApi.listBypid({ pid: 3949 }).then((data) => {
                  const lists = [{ label: '请选择快递公司', value: '' }];
                  data.forEach(element => {
                    lists.push({
                      label: element['name'],
                      value: element['name']
                    });
                  });
                  this.expresses = lists;
                });
                sweetalert.close();
                this.findAddr();
                this.showkaipiaoModal();
              });
            } else {
              this.classifyApi.listBypid({ pid: 3949 }).then((data) => {
                const lists = [{ label: '请选择快递公司', value: '' }];
                data.forEach(element => {
                  lists.push({
                    label: element['name'],
                    value: element['name']
                  });
                });
                this.expresses = lists;
              });
              this.findAddr();
              this.showkaipiaoModal();
            }
          });
        }
      }
      // }
    } else {
      this.toast.pop('warning', '请选择要开票的货物！！！');
    }
  }

  // 提交开票
  submitkaipiao() {
    this.params['billgns'] = {};
    this.billgns.forEach(billgn => {
      if (!billgn.gn) {
        this.toast.pop('warning', '你还没有选择发票的品名！！！');
        return '';
      }
      this.params['billgns'][billgn.gnname] = billgn.gn;
    });
    if (this.params['isonline'] == null) {
      this.toast.pop('warning', '你还没有选择客户的类型！！！');
      return '';
    }
    if (!this.params['type']) {
      this.toast.pop('warning', '你还没有选择发票的类型！！！');
      return '';
    }
    if (!this.params['express']) {
      this.toast.pop('warning', '你还没有选择快递公司！！！');
      return '';
    }
    if (this.params['express'] !== '自领发票') {
      if (!this.params['maddressid']) {
        this.toast.pop('warning', '你还没有选择邮寄地址！！！');
        return '';
      }
    }
    if (confirm('开票人员会根据以上信息进行邮寄，请确定以上信息准确，你确定现在开票吗？')) {
      this.orderApi.createkaipiao(this.params).then(() => {
        this.hidekaipiaoModal();
        this.toast.pop('success', '开票申请成功');
        this.kaipiao_sum = '0';
        this.kaipiao_tweight = '0';
        this.kaipiaoList();
      });
    }
  }

  // 全选按钮
  checkall() {
    this.gridOptions.api.selectAll();
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('kaipiaoModal') private kaipiaoModal: ModalDirective;

  showkaipiaoModal() {
    this.kaipiaoModal.show();
  }

  hidekaipiaoModal() {
    this.kaipiaoModal.hide();
  }
  // 弹出添加地址的对话框
  addAddrDialog() {
    this.addr = {};
    this.provinces = [];
    this.citys = [];
    this.countys = [];
    this.showaddrModal();
    this.getProvince();
  }

  getProvince() {
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
    this.classifyApi.getChildrenTree({ pid: this.addr['provinceid'] }).then((data) => {
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
    this.classifyApi.getChildrenTree({ pid: this.addr['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }

  // 开始往数据库中添加内容
  addAddr() {
    if (!this.addr['provinceid']) {
      this.toast.pop('warning', '请选择省份！');
      return;
    }
    if (!this.addr['cityid']) {
      this.toast.pop('warning', '请选择城市！');
      return;
    }
    if (!this.addr['countyid']) {
      this.toast.pop('warning', '请选择县区！');
      return;
    }
    if (!this.addr['detail']) {
      this.toast.pop('warning', '请填写详细地址！');
      return;
    }
    if (!this.addr['lianxiren']) {
      this.toast.pop('warning', '请填写联系人！');
      return;
    }
    if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.addr['phone'])) {
      this.toast.pop('warning', '请填写正确联系电话！');
      return;
    }
    this.addr['customerid'] = this.maifangids[0];
    this.addr['ismailaddr'] = true;
    console.log(this.addr);
    this.orderApi.addAddr(this.addr).then((data) => {
      this.hideaddrModal();
      this.findAddr();
    });
  }
  showaddrModal() {
    this.addrModal.show();
  }

  hideaddrModal() {
    this.addrModal.hide();
  }
  // agExport() {
  //   const params = {
  //     skipHeader: false,
  //     skipFooters: false,
  //     skipGroups: false,
  //     allColumns: false,
  //     onlySelected: false,
  //     suppressQuotes: false,
  //     fileName: '销售未到票明细表.xls',
  //     columnSeparator: ''
  //   };
  //   this.gridOptions.api.exportDataAsExcel(params);
  // }
  /**数组去重 */
  unique(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i].gnname === arr[j].gnname) { // 第一个等同于第二个，splice方法删除第二个
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  }
}
