import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { RukuService } from './../ruku.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-rukudetail',
  templateUrl: './rukudetail.component.html',
  styleUrls: ['./rukudetail.component.scss']
})
export class RukudetailComponent implements OnInit {

  @ViewChild('zhuanhuoModal') private zhuanhuoModal: ModalDirective;
  // 入库单详情
  rukuModel = [];
  rukuid: number;
  gridOptions: GridOptions;
  huizonggridOptions: GridOptions;
  feegridOptions: GridOptions;
  // 添加对象
  caigoufee = {};
  producefee = {};
  @ViewChild('feedialog') private feedialog: ModalDirective;
  citys: any[] = [];
  countys: any[] = [];
  destination: any;
  provinces: any[] = [];
  provinces2: any[] = [];
  citys2: any[] = [];
  countys2: any[] = [];
  // 添加费用按钮
  detids;
  companyOfProduce;
  actualfeecustomer: any = { name: '', code: '' };
  companyProduce;
  constructor(private actroute: ActivatedRoute, private rukuapi: RukuService, public settings: SettingsService,private addressparseService: AddressparseService,
    private classifyApi: ClassifyApiService,
    private toast: ToasterService, private route: Router) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,

      getNodeChildDetails: (params) => {
        if (params.group) {
          return { group: true,expanded:true , children: params.list, field: 'group', key: params.group };
        } else {
          return null;
        }
      },
      onRowSelected: (params) => {
        if (params.data.group && params.node['selected']) {
          let childs = params.node.childrenAfterGroup;
          childs.forEach(data => {
            data.selectThisNode(true);
          })
        }
      },
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', minWidth: 120, cellRenderer: 'group', checkboxSelection: true, headerCheckboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'id', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangku', minWidth: 100 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gnname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 110 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60 },
      { cellStyle: { 'text-align': 'right' }, headerName: '数量（张）', field: 'amount', minWidth: 88 },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', minWidth: 60 },
      { cellStyle: { 'text-align': 'right' }, headerName: '成本', field: 'cprice', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', minWidth: 60, cellRenderer: (params) => {
          if (!params.data.del && params.data.id) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (params.data.id) {
            sweetalert({
              title: '你确定要删除吗?',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.rukuapi.delRukudet(params.data.id).then((response) => {
                console.log('params', params);
                this.toast.pop('success', '删除成功！');
                this.getDetail();
              });
              sweetalert.close();
            });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'id', minWidth: 75, cellRenderer: (params) => {
          if (!params.data || !params.data.id) {
            return null;
          } else {
            return '<a target="_blank" href="#/chain/' + params.data.id + '">' + params.data.id + '</a>';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ERP库龄', field: 'erpkuling', minWidth: 30 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', minWidth: 30 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 30 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcid', field: 'gcid', minWidth: 75 }
    ];

    this.getDetail();
    // 入库汇总
    this.huizonggridOptions = {
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
    this.huizonggridOptions.onGridReady = this.settings.onGridReady;
    this.huizonggridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.huizonggridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'rukuCollectdet.id', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'rukuCollectdet.goodscode.gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'rukuCollectdet.goodscode.guige', minWidth: 110 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '价格', field: 'rukuCollectdet.price', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'rukuCollectdet.tweight', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'rukuCollectdet.jine', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'rukuCollectdet.grno', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'collectorgname', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ERP库龄', field: 'rukuCollectdet.erpkuling', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'rukuCollectdet.beizhu', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcid', field: 'rukuCollectdet.gcid', minWidth: 75 }
    ];
    // 采购费用
    this.feegridOptions = {
      rowSelection: 'multiple', 
      groupSelectsChildren: true, // 分组可全选
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
      getNodeChildDetails: (params) => {
        if (params.group) {
          return {
            group: true,
            expanded: null != params.group,
            children: params.participants,
            field: 'group',
            key: params.group
          };
        } else {
          return null;
        }
      },
    };
  
    this.feegridOptions.onGridReady = this.settings.onGridReady;
    this.feegridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.feegridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'group', cellRenderer: 'group', minWidth: 40,
      checkboxSelection: true,headerCheckboxSelection: true},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'type', minWidth: 40, valueGetter: (params) => {
          if (params.data['type'] === 1) {
            return '汽运费';
          } else if (params.data['type'] === 2) {
            return '铁运费';
          } else if (params.data['type'] === 3) {
            return '船运费';
          } else if (params.data['type'] === 4) {
            return '出库费';
          } else if (params.data['type'] === 5) {
            return '开平费';
          } else if (params.data['type'] === 6) {
            return '纵剪费';
          } else if (params.data['type'] === 7) {
            return '销售运杂费';
          } else if (params.data['type'] === 8) {
            return '包装费';
          } else if (params.data['type'] === 9) {
            return '仓储费';
          }else if (params.data['type'] === 13) {
            return '入库费';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feename', minWidth: 40 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'feecollect.goodscode.gn', minWidth: 40 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '记账方向', field: 'accountdirection', minWidth: 40, valueGetter: (params) => {
          if (params.data['accountdirection'] === 1) {
            return '采购';
          } else if (params.data['accountdirection'] === 2) {
            return '销售';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '应收应付', field: 'payorreceive', minWidth: 40, valueGetter: (params) => {
          if (params.data['payorreceive'] === 1) {
            return '应付';
          } else if (params.data['payorreceive'] === 2) {
            return '应收';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 40,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', minWidth: 40,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 40,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', minWidth: 40, cellRenderer: (params) => {
          if (params.data.group) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        }, onCellClicked: (params) => {
          if (params.data.group) {
            if (confirm('你确定删除吗？')) {
              this.rukuapi.delcaigoufee(params.data.group).then(data => {
                this.toast.pop('success', '删除成功！');
                this.listFeeDetail();
                this.getDetail();
              });
            }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 60 }
    ];
  }

  ngOnInit() {
    this.rukuid = this.actroute.params['value']['id'];
    this.rukuapi.get(this.actroute.params['value']['id']).then(data => {
      this.rukuModel = data;
      this.gethuizongdetail();
      this.listFeeDetail();
    });
  }

  // 获取入库详情表
  getDetail() {
    this.rukuapi.findAll(this.actroute.params['value']['id']).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // 撤销入库
  delRuku(id) {
    this.rukuapi.revoke(id).then((response) => {
      // this.rukuapi.delRuku(id).then((response1) => {
      // });
      this.toast.pop('success', '完成撤销!');
      this.route.navigateByUrl('ruku');
    });
  }

  addFeeDialog() {
    console.log('添加按钮');
    this.caigoufee = {};
    this.companyOfProduce = {};
    this.companyProduce = [];
    this.detids = new Array();
    const rukudets = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细

    let weight: number = 0;
    for (let i = 0; i < rukudets.length; i++) {
      if (rukudets[i].selected && rukudets[i].data.id) {
        console.log(rukudets[i]);
        console.log('weight', weight);
        weight = weight['add'](rukudets[i].data.weight);
        console.log('weight', weight);
        this.detids.push(rukudets[i].data.id);
      }
    }
    if (this.detids.length <= 0) {
      this.toast.pop('warning', '请选择添加费用的货物');
      return '';
    }
    this.caigoufee['tweight'] = weight;
    this.caigoufee['accountdirection'] = '1';
    this.caigoufee['payorreceive'] = 1;

    this.feedialog.show();
    this.getProvince();
    this.getProvince2();
  }
  // 卖方公司
  innercompany(event) {
    this.caigoufee['paycustomerid'] = event;
  }
  createFee() {
    console.log(this.companyOfProduce);
    if (!this.companyOfProduce) {
      this.toast.pop('warning', '请选择费用单位！');
      return '';
    }
    if (!this.caigoufee['type']) {
      this.toast.pop('warning', '请选择费用类型！');
      return '';
    }
    if((this.caigoufee['type'] === 1 || this.caigoufee['type'] === 2 || this.caigoufee['type'] === 3) && (this.caigoufee['iscarries'] === null|| this.caigoufee['iscarries'] === undefined)){
      this.toast.pop('warning', '请选择是否我司承运！');
      return '';
    }
    if(this.caigoufee['iscarries'] && (!this.caigoufee['sprovinceid'] || !this.caigoufee['scityid'] || !this.caigoufee['scountyid'] || 
          !this.caigoufee['eprovinceid'] || !this.caigoufee['ecityid'] || !this.caigoufee['ecountyid'] || !this.caigoufee['startaddr'] || !this.caigoufee['endaddr'])){
            this.toast.pop('warning', '省市县必填!');
            return '';
    }
    if(!this.caigoufee['feecustomerid']){
      this.toast.pop('warning', '请填写费用单位！');
      return '';
    }
    if (!this.caigoufee['accountdirection']) {
      this.toast.pop('warning', '请选择费用方向！');
      return '';
    }
    if (!this.caigoufee['payorreceive']) {
      this.toast.pop('warning', '请选择应付或者应收！');
      return '';
    }
    // 2017.04.08 费用修改付费单位 cpf MOD start
    if (!this.caigoufee['paycustomerid']) {
      this.toast.pop('warning', '请选择付费单位！');
      return '';
    }
    this.caigoufee['feecustomerid'] = this.companyOfProduce['code'];
    if (this.caigoufee['feecustomerid'] === '9545' && !this.actualfeecustomer) {
      this.toast.pop('warning', '请选择实际费用单位！');
      return;
    }
    this.caigoufee['actualfeecustomerid'] = this.actualfeecustomer['code'];
    this.caigoufee['actualfeename'] = this.actualfeecustomer['name'];
    if (this.caigoufee['actualfeecustomerid'] === this.caigoufee['feecustomerid']) {
      this.toast.pop('warning', '费用单位和实际费用单位重复！');
      return;
    }
    if (this.caigoufee['type'] === 9 && this.caigoufee['accountdirection']!=='1') {
        this.toast.pop('warning', '仓储费只能选择采购的记账方向！');
        return; 
    }
    // 2017.04.08 费用修改付费单位 end
    this.caigoufee['feecustomerid'] = this.companyOfProduce['code'];
    this.caigoufee['idList'] = this.detids;
    console.log(this.caigoufee);
    this.closefeedialog();
    this.rukuapi.createCaigoufee(this.caigoufee).then(() => {
      this.toast.pop('success', '费用添加成功');
      this.listFeeDetail();
    });
  }
  isyunyingzhongxin() {
    console.log(this.companyOfProduce);
    this.caigoufee['feecustomerid'] = this.companyOfProduce['code'];
  }
  // 关闭添加费用弹窗
  closefeedialog() {
    this.feedialog.hide();
  }

  // 单价输入失去焦点
  getjine() {
    if (!this.caigoufee['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    this.caigoufee['jine'] = Math.round(this.caigoufee['tweight'].mul(this.caigoufee['price']) * 100) / 100;
  }

  // 通过金额获取单价
  getprice() {
    if (!this.caigoufee['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    this.caigoufee['price'] = Math.round(this.caigoufee['jine'].div(this.caigoufee['tweight']) * 100) / 100;
  }

  // tslint:disable-next-line:member-ordering
  feetype = [{ label: '汽运费', value: 1 }, { label: '铁运费', value: 2 }, { label: '船运费', value: 3 },
  { label: '出库费', value: 4 }, { label: '开平费', value: 5 }, { label: '纵剪费', value: 6 }, { label: '销售运杂费', value: 7 },
  { label: '包装费', value: 8 }, { label: '仓储费', value: 9 }];

  // 查询费用明细
  listFeeDetail() {
    this.rukuapi.listFeeDetail(this.rukuid).then(data => {
      this.feegridOptions.api.setRowData(data);
    });
  }
  // 汇总全选
  selectall() {
    this.gridOptions.api.selectAll();
  }
  // 汇总查询
  gethuizongdetail() {
    this.rukuapi.listCollectByrukuid(this.rukuid).then(data => {
      console.log('77777_________77777', data);
      this.huizonggridOptions.api.setRowData(data);
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
  getcity() {
    this.citys = [];
    delete this.caigoufee['scityid'];
    delete this.caigoufee['scountyid'];
    this.classifyApi.getChildrenTree({ pid: this.caigoufee['sprovinceid'] }).then((data) => {
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
    delete this.caigoufee['scountyid'];
    this.classifyApi.getChildrenTree({ pid: this.caigoufee['scityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
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

  getcity2() {
    this.citys2 = [];
    delete this.caigoufee['ecityid'];
    delete this.caigoufee['ecountyid'];
    this.classifyApi.getChildrenTree({ pid: this.caigoufee['eprovinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys2.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys2 = [];
    });
  }
  getcounty2() {
    this.countys2 = [];
    delete this.caigoufee['ecountyid'];
    this.classifyApi.getChildrenTree({ pid: this.caigoufee['ecityid'] }).then((data) => {
      data.forEach(element => {
        this.countys2.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  getProvince2() {
    this.provinces2 = [];
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces2.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys2 = [];
      this.countys2 = [];
    });
  }
  /**
 * 根据详细地址自动识别省市县
 */
   
   selecteddes1(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      console.log(addressObj);
      this.citys = []; this.countys = [];
      this.caigoufee['sprovinceid'] = '';
      this.caigoufee['scityid'] = '';
      this.caigoufee['scountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.caigoufee['sprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.caigoufee['sprovinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.caigoufee['scityid'] = addressObj['cityValue'];
                this.getpcc(this.caigoufee['scityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      this.caigoufee['scountyid'] = addressObj['countyValue'];
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }
  selecteddes2(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      console.log(addressObj);
      this.citys2 = []; this.countys2 = [];
      this.caigoufee['eprovinceid'] = '';
      this.caigoufee['ecityid'] = '';
      this.caigoufee['ecountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces2.length) {
          this.caigoufee['eprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.caigoufee['eprovinceid'], this.citys2).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.caigoufee['ecityid'] = addressObj['cityValue'];
                this.getpcc(this.caigoufee['ecityid'], this.countys2).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      this.caigoufee['ecountyid'] = addressObj['countyValue'];
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }


  //货物批量删除明细
  rukudetids: any = [];
  deleterukudet() {
    this.rukudetids = new Array();
    const rukudetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < rukudetlist.length; i++) {
      if (rukudetlist[i].selected && rukudetlist[i].data && rukudetlist[i].data['id']) {
        this.rukudetids.push(rukudetlist[i].data.id);
      }
    }
    if (!this.rukudetids.length) { 
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.rukuapi.deleterukudet(this.rukudetids).then(data => {
        this.toast.pop('success', '删除成功！'); 
        this.getDetail();
        this.listFeeDetail();
   
    });
    }
  } 

     //费用批量删除明细
     rukudetfeeids: any = [];
    deleterukudetfee() {
this.rukudetfeeids = new Array();
    const rukudetfeeidslist = this.feegridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < rukudetfeeidslist.length; i++) {
if (rukudetfeeidslist[i].selected && rukudetfeeidslist[i].data && rukudetfeeidslist[i].data['id']) {
        this.rukudetfeeids.push(rukudetfeeidslist[i].data.id);
      }
    }
    if (!this.rukudetfeeids.length) { 
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) 
      this.rukuapi.deletefee(this.rukudetfeeids).then(data => {
        this.toast.pop('success', '删除成功！'); 
        this.listFeeDetail();
        this.getDetail();
      });
    }
  }  
  
 
 
    
  


