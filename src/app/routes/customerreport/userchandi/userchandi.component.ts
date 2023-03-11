import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { CaigouService } from '../../caigou/caigou.service';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { CustomerapiService } from '../../customer/customerapi.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-userchandi',
  templateUrl: './userchandi.component.html',
  styleUrls: ['./userchandi.component.scss']
})
export class UserchandiComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('addModal') private addModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  gangchangs: any[];
  gridOptions: GridOptions;
  query = { chandi: '', customerid: '',gn: '' };
  // 品名
  gns: any[];
  gn;
  // 产地
  chandis: any[];
  cs: any[];
  add = { customerid: '', chandi: '', gn: '' };
  isChandi = false;
  companys = {};
  qcompanys = {};
  chandimodal;
  qchandimodal;
  gnmodal;
  chandioptions: any = [];
  queryandcreate = 0; // 0-创建，1-查询
  constructor(public settings: SettingsService, private caigouApi: CaigouService, private classifyApi: ClassifyApiService,
    private customerApi: CustomerapiService, private toast: ToasterService) {
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制 single
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    };
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '代理商', field: 'customer', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 100,
        cellRenderer: (params) => {
          return '<a target="_blank">删除</a>';
        },
        onCellClicked: (params) => {
          if (confirm('你确定要删除吗？')) {
            this.customerApi.removeUserchandi(params.data.id).then((response) => {
              this.toast.pop('success', '删除成功');
              this.querys();
            });
          }
        }
      }
    ];
    this.querys();
  }

  ngOnInit() {
  }
  openQueryDialog() {
    this.qcompanys = {};
    this.qchandimodal = '';
    this.query = { chandi: '', customerid: '', gn: '' };
    this.chandioptions = [];
    // this.caigouApi.getchandi().then(data => {
    //   this.gangchangs = data;
    // });
    this.showclassicModal();
  }
  showclassicModal() {
    this.classicModal.show();
  }
  hideclassicModal() {
    this.classicModal.hide();
  }
  selectegangchang(value) {
    this.query['chandiid'] = value.id;
  }
  querys() {
    console.log(this.query);
    if (typeof (this.qcompanys) === 'string' || !this.qcompanys) {
      this.query['customerid'] = '';
    } else if (typeof (this.qcompanys) === 'object') {
      this.query.customerid = this.qcompanys['code'];
    }
    this.customerApi.getUserChandi(this.query).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  search() {
    this.querys();
    this.hideclassicModal();
  }
  openAddDialog() {
    this.companys = {};
    this.chandimodal = '';
    this.gnmodal = '';
    this.add = { customerid: '', chandi: '', gn: '' };
    this.gns = [];
    this.chandioptions = [];
    // this.classifyApi.getGnAndChandi().then(data => {
    //   data.forEach(element => {
    //     this.gns.push({
    //       label: element.name,
    //       value: element
    //     });
    //   });
    // });
    this.addModal.show();
  }
  selectedgn(value) {
    // console.log('0002', value);
    this.cs = [];
    this.chandis = [];
    this.add['gnid'] = value.id;
    this.add['chandiid'] = '';
    this.cs = value.attrs;
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.isChandi = true;
    // console.log('chandis', this.chandis);
  }
  selectedchandi(value) {
    // console.log('c', value);
    this.add['chandiid'] = value;
  }
  adduser() {
    if (typeof (this.companys) === 'string' || !this.companys) {
      this.add['customerid'] = '';
    } else if (typeof (this.companys) === 'object') {
      this.add.customerid = this.companys['code'];
    }
    if (!this.add['gn']) {
      this.toast.pop('warning', '请选择品名');
      return;
    }
    if (!this.add['chandi']) {
      this.toast.pop('warning', '请选择产地');
      return;
    }
    if (!this.add['customerid']) {
      this.toast.pop('warning', '请选择代理商');
      return;
    }
    // console.log(this.add);
    this.customerApi.createUserchandi(this.add).then(data => {
      this.toast.pop('success', '添加成功');
      this.closeq();
      this.querys();
    });
  }
  closeq() {
    this.addModal.hide();
  }
  showmdmgndialog(flag) {
    this.queryandcreate = flag;
    this.mdmgndialog.show();
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    if (this.queryandcreate === 0) {
      this.chandioptions = [];
      for (let index = 0; index < attrs.length; index++) {
        const element = attrs[index];
        if (element['value'] === 'chandi') {
          this.chandioptions = element['options'];
          break;
        }
      }
      this.add['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.add['chandi'] = this.chandioptions[0]['value'];
      }
    } else if (this.queryandcreate === 1) {
      this.chandioptions = [];
      for (let index = 0; index < attrs.length; index++) {
        const element = attrs[index];
        if (element['value'] === 'chandi') {
          this.chandioptions = element['options'];
          break;
        }
      }
      this.query['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.query['chandi'] = this.chandioptions[0]['value'];
      }
    }
  }
}
