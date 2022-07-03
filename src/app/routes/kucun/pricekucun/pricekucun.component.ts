import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { GetdayPipe } from './../../../dnn/shared/pipe/getday.pipe';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { KucunService } from './../kucun.service';
import { GridOptions } from 'ag-grid/main';
import { StorageService } from './../../../dnn/service/storage.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-pricekucun',
  templateUrl: './pricekucun.component.html',
  styleUrls: ['./pricekucun.component.scss']
})
export class PricekucunComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private storage: StorageService, private kucunapi: KucunService,
    private toast: ToasterService, private datepipe: DatePipe, private getday: GetdayPipe, private classifyapi: ClassifyApiService,
    private router: Router, private http: Http) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      suppressRowClickSelection: true,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      // onCellEditingStopped: this.newValueHandler,
      enableFilter: true
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;


    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'gn', minWidth: 50, suppressMenu: true,
        checkboxSelection: true, pinned: 'left'
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gc.gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangku', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 57 },
      {
        cellStyle: { 'display': 'block' }, headerName: '货物规格', headerClass: 'wis-ag-center',
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'gc.chandi', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'gc.width', minWidth: 60 },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'gc.houdu', minWidth: 60,
            valueFormatter: this.settings.valueFormatter3
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '颜色锌花', field: 'gc.color', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'gc.duceng', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'gc.caizhi', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'gc.ppro', minWidth: 60 },
        ]
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '线上价格', field: 'olprice', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '线下价格', field: 'price', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '库存', headerClass: 'wis-ag-center',
        children: [{
          cellStyle: { 'text-align': 'center' }, headerName: '数量', field: 'amount', minWidth: 60, cellRenderer: (parmas) => {
            if (parmas.data.amount) {
              return '<a target="_blank">' + parmas.data.amount + '</a>';
            } else {
              return '<a target="_blank">' + 0 + '</a>';
            }
          }, onCellClicked: this.pricekucundetail
        },
        {
          cellStyle: { 'text-align': 'center' }, headerName: '总重量', field: 'tweight', minWidth: 60,
          valueFormatter: this.settings.valueFormatter3
        },
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '线上库存', headerClass: 'wis-ag-center',
        children: [
          {
            cellStyle: { 'text-align': 'center' }, headerName: '现有数量', field: 'olamount', minWidth: 100, cellRenderer: (parmas) => {
              if (parmas.data.olamount) {
                return '<a target="_blank">' + parmas.data.olamount + '</a>';
              } else {
                return '<a target="_blank">' + 0 + '</a>';
              }
            }, onCellClicked: this.pricekucundetail
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '总重量', field: 'oltweight', minWidth: 60,
            valueFormatter: this.settings.valueFormatter3
          },
          // {
          //   cellStyle: { 'text-align': 'center' }, headerName: '应有数量', field: 'quantity', minWidth: 60, editable: true,
          //   cellRenderer: (params) => {
          //     if (params.value === null || params.value === undefined) {
          //       return null;
          //     } else if (isNaN(params.value)) {
          //       return 'NaN';
          //     } else {
          //       return params.value;
          //     }
          //   }
          // }
        ]
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否上架', field: 'isshelve', minWidth: 57,
        cellRenderer: (params) => {
          // if (params.value === '是') {
          //   params.data.isshelve = true;
          // } else if (params.value === '否') {
          //   params.data.isshelve = false;
          // }
          if (params.data.isshelve) {
            return '<span title="true" class="ag-icon ag-icon-tick content-icon"></span>';
          } else {
            return '<span title="false" class="ag-icon ag-icon-cross content-icon"></span>';
          }
        },
        valueGetter: (params) => {
          if (params.data.isshelve) {
            return '是';
          } else {
            return '否';
          }
        }
      }
    ];

    this.kcmxgridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      suppressRowClickSelection: true,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true
    };

    this.kcmxgridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.kcmxgridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.kcmxgridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'gn', minWidth: 80, suppressMenu: true, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂资源号', field: 'grno', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'nrno', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 57 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '米数', field: 'length', minWidth: 57 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '线上库存', field: 'online', minWidth: 57, valueGetter: (parmas) => {
          if (parmas.data['lockid']) {
            return '是';
          } else {
            return '否';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库龄（ERP）', field: 'kuling', minWidth: 57,
        valueGetter: (parmas) => this.getday.transform(parmas.data['kuling'])
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '入库库龄', field: 'cdate', minWidth: 57,
        valueGetter: (parmas) => this.getday.transform(parmas.data['cdate'])
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '入库时间', field: 'cdate', minWidth: 57,
        valueGetter: (parmas) => this.datepipe.transform(parmas.data['cdate'], 'y-MM-dd hh:mm:ss')
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否锁定', field: 'lockid', minWidth: 57, valueGetter: (parmas) => {
          if (parmas.data['lockid']) { return '是' } else { return '否' }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否下单', field: 'orderid', minWidth: 57, valueGetter: (parmas) => {
          if (parmas.data['orderid']) { return '是' } else { return '否' }
        }
      }]
  }

  ngOnInit() {
    this.listDetail();
  }

  // 查询所有上架下架货物
  listDetail() {
    this.kucunapi.listPriceAndKucun().then(data => {
      this.gridOptions.api.setRowData(data['maplist']);
    })
  }

  // 单个上架
  shelve = (parmas) => {
    if (confirm('你确定规格为‘' + parmas['data'].gc.guige + '’上架吗？')) {
      this.kucunapi.shelve({ cangkuid: parmas['data'].pckid, gcid: parmas['data'].pgcid }).then(data => {
        this.toast.pop('success', '上架成功！')
        this.gridOptions.api.refreshView();
      })
    }
  }

  // 所选规格的上架操作
  shelvestotal() {
    const params = [];
    const rowsparams = this.gridOptions.api.getModel()['rowsToDisplay'];
    const rows = [];
    rowsparams.forEach(item => {
      if (item.selected) {
        rows.push(item.data);
      }
    });
    if (!rows.length) {
      this.toast.pop('warning', '请选择要上架的库存！');
      return;
    }
    rows.forEach(item => {
      const objectparams = {
        priceid: item.id, olweight: item.oltweight, tweight: item.tweight
      };
      params.push(objectparams);
    });
    params.forEach(item => {
      delete item.gc;
    });
    sweetalert({
      title: '你确定要提交上架发起审批吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.http.post(`store/api/offonshelve/create`, params).subscribe(data => {
        const data1 = data.json();
        if (data1['id']) {
          this.router.navigate(['pricekucundateil', data1['id']]);
        } else {
          this.toast.pop('success', '上架成功！');
          this.listDetail();
        }
        sweetalert.close();
      });
    });
  }

  // 类货物的下架操作
  offShelveCategory() {
    const params = [];
    const rowsparams = this.gridOptions.api.getModel()['rowsToDisplay'];
    const rows = [];
    rowsparams.forEach(item => {
      if (item.selected) {
        rows.push(item.data);
      }
    });
    if (!rows.length) {
      this.toast.pop('warning', '请选择要下架的库存！');
      return;
    }
    const isdown = rows.some(item => !item.isshelve);
    if (isdown) {
      this.toast.pop('warning', '请选择已上架的库存！');
      return;
    }
    rows.forEach(item => {
      const objectparams = {
        priceid: item.id, olweight: item.olweight, tweight: item.tweight
      };
      params.push(objectparams);
    });
    params.forEach(item => {
      delete item.gc;
    });
    sweetalert({
      title: '你确定要下架吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.http.post(`store/api/offonshelve/offshelve`, params).subscribe(data => {
        sweetalert.close();
        this.listDetail();
        this.toast.pop('success', '下架成功!');
      });
    });
  }

  // 在agggird中修改表格数据
  newValueHandler = (params) => {
    console.log(params.value);
    if (confirm('你确定要修改吗？')) {
      let paramjson = {};
      // paramjson['quantity'] = params.value;
      // paramjson['olkucuncount'] = params.data.olamount;
      paramjson['isshelve'] = params.data.isshelve;
      console.log(paramjson);
      this.kucunapi.modifyPriceQuantity(params.data.id, paramjson).then((response) => {
        this.toast.pop('success', '修改成功');
        if (params.data.isshelve) {
          params.data.olamount = response.count;
          params.data.oltweight = response.tweight;
        } else {
          params.data.olamount = '0';
          params.data.oltweight = '0';
        }
        params.api.recomputeAggregates();
      });
    }
    // 要查询条件
    //let num = new RegExp('^[0-9]*$');
    //if (params.value && num.test(params.value)) {
    // } else {
    //   params.api.recomputeAggregates();
    //   this.toast.pop('error', '格式不正确，请填写数字');
    // }
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  // 显示上线，下线库存汇总明细
  sclassicModal() {
    this.classicModal.show();
  }

  // 关闭上线，下线库存汇总明细
  cclassicModal() {
    this.classicModal.hide();
  }

  // 定义显示线上线下库存汇总明细
  kcmxgridOptions: GridOptions;

  // 点击数量跳转线上线下库存汇总明细
  pricekucundetail = (params) => {
    this.sclassicModal();
    let search = {};
    if (params.node.data) {
      search['gcid'] = params.node.data.pgcid; // gcid;
      search['cangkuid'] = params.node.data.pckid; // 仓库id；
      search['orgid'] = params.node.data.orgid; // 仓库id；
      if (params.column['colId'] === 'amount') search['online'] = false;
      if (params.column['colId'] === 'olamount') search['online'] = true;
      // search['pagenum'] = 1;
      // search['pagesize'] = 5100;
      console.log(search);
      this.flag = search;
      this.getlistpriceand();
    }
  }

  getlistpriceand() {
    this.flag['pagenum'] = 1;
    this.flag['pagesize'] = 5100;
    this.kucunapi.pagepriceandkucundet(this.flag).then(data => {
      this.kcmxgridOptions.api.setRowData(data);
    });
  }

  // 全选按钮
  checkAll() {
    this.kcmxgridOptions.api.selectAll();
  }

  // 关闭按钮
  closehz() {
    this.cclassicModal();
  }

  flag = {};

  offshelves() {
    let kucunidlist = [];
    kucunidlist = this.kcmxgridOptions.api.getSelectedRows();

    if (kucunidlist.length > 0) {
      const kucunids = [];
      kucunidlist.forEach(element => {
        // if (element.id) {
        kucunids.push(element.id);
        // } else {
        //   this.toast.pop('warning', '此货物已下单');
        //   return;
        // }
      });

      if (kucunids.length > 0) {
        if (confirm('你确定将该货物下架吗？')) {
          this.kucunapi.offShelve({ kucunids: kucunids }).then(() => {
            this.toast.pop('success', '下架成功');
            this.getlistpriceand();
          });
        }
      } else {
        this.toast.pop('warning', '请选择要下架的货物');
      }
    } else {
      this.toast.pop('warning', '请选择要下架的货物');
    }
  }
  //统调上下架数量
  tongtiaocountmodel: any = { areaid: null, cangkuid: null, flag: null, gn: null, chandi: null, count: null, gcs: null };
  @ViewChild('tongtiaocount') private tongtiaocount: ModalDirective;
  tongtiaocountdialog() {
    this.tongtiaocountmodel = { areaid: null, cangkuid: null, flag: null, gnid: null, chandiid: null, count: null, gcs: null };
    this.getareas();
    this.getGnAndChandi();
    this.tongtiaocount.show();
  }
  tongtiaocountcreate() {
    if (!this.tongtiaocountmodel['flag']) {
      this.toast.pop('warning', '请选择是否上架');
      return;
    }
    if (this.tongtiaocountmodel['flag'] === '1') {
      this.tongtiaocountmodel['flag'] = true;
    } else {
      this.tongtiaocountmodel['flag'] = false;
    }
    if (!this.tongtiaocountmodel['gnid'] && !this.tongtiaocountmodel['chandiid']) {
      if (confirm('你确定要操作吗')) {
        this.kucunapi.createshelvlog(this.tongtiaocountmodel).then((data) => {
          this.tongtiaodialogcoles();
          if (this.tongtiaocountmodel['flag']) {
            if (data['id']) {
              this.router.navigate(['pricekucundateil', data['id']]);
            } else {
              this.listDetail();
              this.toast.pop('success', '统调成功');
            }
          } else {
            this.listDetail();
            this.toast.pop('success', '统调成功');
          }
        });
      }
      return;
    }

    if (this.gcs) {
      this.tongtiaocountmodel['gcs'] = this.gcs;
    }
    if (this.tongtiaocountmodel['gnid']) {
      this.tongtiaocountmodel['gnid'] = this.tongtiaocountmodel['gnid']['id'];
    }
    if (confirm('你确定要调整是否上架吗？')) {
      this.kucunapi.getTiaoPriceCount(this.tongtiaocountmodel).then((res) => {
        console.log('88888888', res);
        if (confirm('根据输入的条件：' + res['describe'] + ',共查询' + res['pricelist'].length + '条数据，你确定要调整上下架吗？')) {
          const priceid = [];
          res['pricelist'].forEach(element => {
            priceid.push(element.id);
          });
          const countlog = {
            flag: this.tongtiaocountmodel['flag'], priceid: priceid, describe: res['describe']
          };
          this.kucunapi.createshelvlog(countlog).then((data) => {
            this.tongtiaodialogcoles();
            if (this.tongtiaocountmodel['flag']) {
              if (data['id']) {
                this.router.navigate(['pricekucundateil', data['id']]);
              } else {
                this.listDetail();
                this.toast.pop('success', '统调成功');
              }
            } else {
              this.listDetail();
              this.toast.pop('success', '统调成功');
            }
          });
        }
      });
    }

  }
  tongtiaodialogcoles() {
    this.tongtiaocount.hide();
  }

  areas: any[];
  getareas() {
    this.areas = [];
    this.classifyapi.getareas().then(data => {
      data.forEach(element => {
        this.areas.push({
          label: element['name'],
          value: element['id']
        })
      });
    })
  }
  cangkus: any[];
  iscangku: boolean = false;
  getcangkus(areaid) {
    console.log(areaid);
    this.iscangku = true;
    this.cangkus = [];
    this.classifyapi.getcangkus(areaid).then(data => {
      console.log(data);
      data.forEach(element => {
        this.cangkus.push({
          label: element['name'],
          value: element['id']
        })
      });
    })
  }
  gns: any[];
  getGnAndChandi() {
    this.gns = [];
    this.classifyapi.getGnAndChandi().then((data) => {
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        })
      })
    });
  }
  chandis: any[];
  isChandi: boolean = false;
  selectedgn(value) {
    console.log(value);
    this.tongtiaocountmodel['gnid'] = value;
    this.isChandi = true;
    this.attrs = [];
    this.chandis = [];
    this.gcs = [];
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
  }
  attrs: any[]; widths: any[]; houdus: any[]; colors: any[]; caizhis: any[]; ducengs: any[];
  showGuige: boolean = false;
  selectedchandi(value) {
    this.attrs = []; this.widths = []; this.houdus = []; this.colors = []; this.caizhis = []; this.ducengs = [];
    this.classifyapi.getAttrs(value).then(data => {
      this.attrs = data;
      this.attrs.forEach(element => {
        if (element.label === '厚度') {
          element.options.forEach(option => {
            this.widths.push({
              value: option['value'],
              label: option['label']
            })
          });
        } else if (element.label === '宽度') {
          element.options.forEach(option => {
            this.houdus.push({
              value: option['value'],
              label: option['label']
            })
          });
        } else if (element.label === '颜色') {
          element.options.forEach(option => {
            this.colors.push({
              value: option['value'],
              label: option['label']
            })
          });
        } else if (element.label === '材质') {
          element.options.forEach(option => {
            this.caizhis.push({
              value: option['value'],
              label: option['label']
            })
          });
        } else if (element.label === '锌层') {
          element.options.forEach(option => {
            this.ducengs.push({
              value: option['value'],
              label: option['label']
            })
          });
        }
      });
    });
    this.showGuige = true;
  }
  gcs: any[] = [];
  selectedguige(event, labelid) {
    for (let i = 0; i < this.gcs.length; i++) {
      if (this.gcs[i]['name'] === labelid) {
        this.gcs.splice(i, 1);
      }
    }
    this.gcs.push({ name: labelid, value: event['value'] });
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.tongtiaocountmodel['gn'] = item.itemname;
    this.attrs = [];
    this.attrs = attrs;
    this.showGuige = true;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      element['options'].unshift({ value: '', label: '全部' });
    }
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      if (element['defaultval'] && element['options'].length) {
        this.tongtiaocountmodel[element['value']] = element['defaultval'];
      }
    }
  }
}
