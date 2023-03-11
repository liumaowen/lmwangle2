import { element } from 'protractor';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { PriceapiService } from './../priceapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {

  // 查询的弹窗
  // @ViewChild('classicModal') private classicModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  flag = 0;

  // 调价获取的参数
  params = {};

  search: any = {};

  gridOptions: GridOptions;
  disabled = true;
  constructor(public settings: SettingsService,
    private priceApi: PriceapiService,
    private router: Router,
    private toast: ToasterService,
    private userapi: UserapiService,
    private pricelogdetApi: PriceapiService,
    private storage: StorageService,
    private classifyapi: ClassifyApiService) {
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 50, suppressMenu: true, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 120,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 90
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色/锌层', field: 'color', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', width: 120 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '价差', field: 'diff', width: 110,
        cellRenderer: (params) => {
          return (parseFloat(params.data.olprice ? params.data.olprice : '0')
            - parseFloat(params.data.price ? params.data.price : '0')) + '';
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '线下价格', field: 'price', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '线上价格', field: 'olprice', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'comments', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '库存量', field: 'kucunaccount', width: 100,
        valueFormatter: this.settings.valueFormatter
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否上架', field: 'isup', width: 100
      }
    ];
    this.getMyRole();

    //this.listDetail();

  }

  ngOnInit() {
  }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.priceApi.listprice(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });

  }

  // 全部选择
  checkAll() {
    this.gridOptions.api.selectAll();
  }



  // 调价功能
  changePrice() {
    const templog = {};
    const ids = new Array();
    const price = this.gridOptions.api.getModel()['rowsToDisplay'];
    let orgid = undefined;
    for (let i = 0; i < price.length; i++) {
      if (price[i].selected) {
        if (!orgid) orgid = price[i].data.orgid;
        if (orgid !== price[i].data.orgid) {
          this.toast.pop('warning', '请选择同一机构的货物');
          return '';
        }
        ids.push(price[i].data.priceid);
      }
    }
    console.log(ids);
    if (ids.length) {
      if (confirm('你确定要将选择的差价调整吗？')) {
        templog['pricelogid'] = 0;
        templog['priceids'] = ids;
        templog['isv'] = true;
        this.router.navigate(['pricelogdet', 0], { queryParams: templog });
      }
    } else {
      this.toast.pop('warning', '请选择要调整的差价');
    }
  }

  // showclassicModal() {
  //   this.classicModal.show();
  // }
  //   this.classicModal.hide();
  // }

  // 统调前准备数据
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
    this.search['gnid'] = value['id'];
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
        console.log(element);
        if (element.label === '厚度') {
          element.options.forEach(option => {
            this.houdus.push({
              value: option['value'],
              label: option['label']
            })
          });
        } else if (element.label === '宽度') {
          element.options.forEach(option => {
            this.widths.push({
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
    console.log('op', event + '_____9999999999_____' + labelid);
    for (let i = 0; i < this.gcs.length; i++) {
      if (this.gcs[i]['name'] === labelid) {
        this.gcs.splice(i, 1);
      }
    }
    this.gcs.push({ name: labelid, value: event['value'] });
    console.log('----------------', this.gcs);
  }

  // 统调功能
  tongtiaomodel: any = {
    isonline: '0', orgid: null, areaid: null, cangkuid: null, gnid: null,
    chandiid: null, isdifftiao: null, lastprice: null, gcs: null
  };

  @ViewChild('tongtiao') private tongtiao: ModalDirective;

  tongtiaodialog() {
    this.getareas();
    this.getGnAndChandi();
    this.tongtiao.show();
  }
  tongtiaodialogcoles() {
    this.tongtiao.hide();
  }
  //统调
  tongtiaocreate() {
    if (!this.tongtiaomodel['orgid']) {
      this.toast.pop('warning', '请选择机构');
      return;
    }
    if (!this.tongtiaomodel['isdifftiao']) {
      this.toast.pop('warning', '请选择调整类型');
      return;
    }
    //是线上统调但不是调整的价差不允许
    if (this.tongtiaomodel['isonline'] === 1 && this.tongtiaomodel['isdifftiao'] !== 1) {
      this.toast.pop('warning', '线上统调只允许调整价差！');
      return;
    }
    if (!this.tongtiaomodel['lastprice']) {
      this.toast.pop('warning', '请选择统调值');
      return;
    }
    if (this.gcs) {
      this.tongtiaomodel['gcs'] = this.gcs;
    }
    if (confirm('你确定要创建调价单吗？')) {
      if (this.tongtiaomodel['gnid']) {
        this.tongtiaomodel['gnid'] = this.tongtiaomodel['gnid']['id'];
      }
      console.log(this.tongtiaomodel);
      this.priceApi.getTiaoPriceCount(this.tongtiaomodel).then((res) => {
        console.log('88888888', res);
        if (confirm('根据输入的条件：' + res['describe'] + ',共查询' + res['pricelist'].length + '条价格，你确定要创建调价单吗？')) {
          const priceid = [];
          res['pricelist'].forEach(element => {
            priceid.push(element.id);
          });
          const pricelog = {
            isonline: this.tongtiaomodel['isonline'],
            orgid: this.tongtiaomodel['orgid'], isdifftiao: this.tongtiaomodel['isdifftiao'],
            lastprice: this.tongtiaomodel['lastprice'], describe: res['describe'], priceid: priceid
          };
          console.log('1233', pricelog);
          this.pricelogdetApi.judgeprice(pricelog).then((response) => {
            if(response['islowprice']){
              if(confirm('该调价单中，存在宽度：'+ response['width'] +'厚度：'+response['houdu']+'重量：'+response['weight']+'捆包号：'+response['kunbaohao']+'钢卷，定价'+response['gjdprice']+'元，原内采单价'+response['gjyprice']+'元')){
                  this.priceApi.createpricelog(pricelog).then((data) => {
                      this.router.navigate(['pricelogdet', data]);
                      this.toast.pop('success', '调价单创建成功');
                       this.tongtiaodialogcoles();
                  })
              }
            }else{
              this.priceApi.createpricelog(pricelog).then((data) => {
                this.router.navigate(['pricelogdet', data]);
                this.toast.pop('success', '调价单创建成功');
                 this.tongtiaodialogcoles();
              })
            }
         });
        }
      })
    }


  }

  createselectNull() {
    this.tongtiaomodel = { orgid: null, areaid: null, cangkuid: null, gn: null, chandi: null, isdifftiao: null, lastprice: null, gcs: null };
  }
  //查询弹出窗口
  @ViewChild('pricedialog') private pricedialog: ModalDirective;
  finddialog() {
    this.search = {};
    this.cangkus = [];
    this.userapi.cangkulist().then(data => {
      data.forEach(element => {
        this.cangkus.push({
          value: element['id'],
          label: element['name']
        });
      });
    });

    this.attrs = [];
    this.disabled = true;
    // this.getGnAndChandi();
    this.pricedialog.show();
  }
  closepricedialog() {
    this.pricedialog.hide();
  }
  findprice() {
    this.listDetail();
    this.closepricedialog();
  }
  showmdmgndialog(flag) {
    this.flag = flag;
    this.mdmgndialog.show();
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    if (this.flag === 0) {
      this.search['gn'] = item.itemname;
      this.disabled = false;
      for (let i = 0; i < attrs.length; i++) {
        const element = attrs[i];
        this.search[element.value] = '';
        element['options'].unshift({ value: '', label: '全部' });
      }
      this.attrs = attrs;
      for (let i = 0; i < this.attrs.length; i++) {
        const element = this.attrs[i];
        if (element['defaultval'] && element['options'].length) {
          this.search[element['value']] = element['defaultval'];
        }
      }
    } else {
      this.tongtiaomodel['gn'] = item.itemname;
      this.showGuige = true;
      for (let i = 0; i < attrs.length; i++) {
        const element = attrs[i];
        this.tongtiaomodel[element.value] = '';
        element['options'].unshift({ value: '', label: '全部' });
      }
      this.attrs = attrs;
      for (let i = 0; i < this.attrs.length; i++) {
        const element = this.attrs[i];
        if (element['defaultval'] && element['options'].length) {
          this.tongtiaomodel[element['value']] = element['defaultval'];
        }
      }
    }
  }
  isshowbiansitiaojia = false;
  getMyRole() {
    let current = this.storage.getObject('cuser');
    if(current['id'] !== 18001){
      this.isshowbiansitiaojia = true;
    }
  }
}
