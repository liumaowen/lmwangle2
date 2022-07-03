import { ToasterService } from 'angular2-toaster';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { ReportService } from 'app/routes/report/report.service';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { DatePipe } from '@angular/common';
import { XiaoshouapiService } from '../xiaoshouapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BusinessorderapiService } from 'app/routes/businessorder/businessorderapi.service';
import { StorageService } from 'app/dnn/service/storage.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-cangkutihuodetail',
  templateUrl: './cangkutihuodetail.component.html',
  styleUrls: ['./cangkutihuodetail.component.scss']
})
export class CangkutihuodetailComponent implements OnInit {
  // 控制页面按钮显示与否
  showflag: any = {};
  tihuo: any = {};

  gridOptions: GridOptions;
  
  constructor(public settings: SettingsService, private fb: FormBuilder, private tihuoApi: XiaoshouapiService,
    private route: ActivatedRoute, private datepipe: DatePipe,
    private storage: StorageService, private toast: ToasterService, private businessOrderApi: BusinessorderapiService,
    private router: Router, private modalService: BsModalService) {
    // 设置提货明细表
    this.gridOptions = {
      rowSelection: 'multiple',
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
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
      }
    };
    // 设置临调明细表    
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置明细表表格数据
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', width: 70, cellRenderer: 'group', checkboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyer.name', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', width: 260,
        cellRenderer: (params) => {// 如有长度，规格中添加长度
          if (params.data.goodscode) {
            let guiges = params.data.goodscode.guige.split(',');
            if (params.data.isfp && params.data.length != 0) {
              guiges[1] = guiges[1] + '*' + params.data.length;
            } else {
              guiges[1] = guiges[1] + '*C';
            }
            let guige = '';
            guiges.forEach(element => {
              guige = guige + element + ',';
            });
            return guige;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'cangku.name', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'pertprice', width: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 100, editable: true,
        onCellValueChanged: params => {
          let search = { saleweight: params.newValue };
          this.tihuoApi.modifyWeight(params.data.id, search).then(data => {
            this.toast.pop('success', '重量修改成功！');
            this.listDetail();
          })
        }, cellRenderer: params => {
          // console.log(params);
          if (!params.data.isldmodify) {
            params.data.editable = false;
          }
          return params.data.weight;
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 120
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '配送方式', field: 'order.type | type', width: 100,
        cellRenderer: (params) => {
          if (params.data.orderdet) {
            if (params.data.orderdet.order.type === 0) {
              return '自提';
            } else if (params.data.orderdet.order.type === 1) {
              return '代运';
            } else {
              return '转货';
            }
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '出库费结算', field: 'chukufeetype', width: 120,
        cellRenderer: (params) => {
          if (params.data.chukufeetype === 0) {
            return '现结';
          } else if (params.data.chukufeetype === 1) {
            return '月结';
          } else if (params.data.chukufeetype === 2) {
            return '免付';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '出库费单价', field: 'orderdet.perchukuprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '货物状态', field: 'goodsstatus', width: 100,
        cellRenderer: (params) => {
          if (!params.data.group) {
            if (null != params.data.status && 'true' == params.data.status.toString()) {
              return '实提';
            } else if (null != params.data.status && 'false' == params.data.status.toString()) {
              return '退回';
            } else {
              return '';
            }
          }
        }
      },
     
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否退货', field: 'isxstuihuo', width: 90,
        cellRenderer: (params) => {
          if (!params.data.group) {
            if (params.data.isxstuihuo) { return '是'; } else { return '否'; }
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否补差', field: 'isxsbucha', width: 90,
        cellRenderer: (params) => {
          if (!params.data.group) {
            if (params.data.isxsbucha) { return '是'; } else { return '否'; }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'tihuo.cdate', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 90,
        cellRenderer: (params) => {
          if (params.data.tihuo) {
            if (params.data.tihuo.isld) {
              return '';
            }
            return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细id', field: 'id', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存备注', field: 'beizhu', width: 120 }
    ];

    this.listDetail();
  }

  ngOnInit() {
  }  
  
  current = this.storage.getObject('cuser');
  listDetail() {
    this.tihuoApi.get(this.route.params['value']['id']).then((response) => {
      this.tihuo = response['tihuo'];
      this.gridOptions.api.setRowData(response['list']);
      if (!this.tihuo.isdel) {
        if ((this.tihuo.status === 1) || (this.tihuo.status === 1 && this.tihuo.isonline)) {// 提货单的已准备发货状态
          this.showflag.shiti = true;
        } else {
          this.showflag.shiti = false;
        }
        if (this.tihuo.status !== 2) {// 提货单的已准备发货状态
          this.showflag.print = true;
        } else {
          this.showflag.print = false;
        }
      }
    });
  } 
  
  tihuoentity = { goodsstatus: false };
  // 完成 提货单中已经完成实提的货物
  finishtihuo() {
    if (this.tihuo.status == 1) {
      let tihuodets = this.gridOptions.api.getModel()['rowsToDisplay'];// 获取选中的提货单明细。      
      let tihuodetids = new Array();
      for (let i = 0; i < tihuodets.length; i++) {
        if (!tihuodets[i].data.group) {
          console.log(tihuodets[i].data.tihuo.isprint);
          if (!tihuodets[i].data.tihuo.isprint) {
            this.toast.pop('warning', '未打印的提单不能做实提');
            return;
          }
          if (tihuodets[i].selected) {
            if (null != tihuodets[i].data.status) {
              this.toast.pop('warning', '货物状态已有，不能再次改变。');
              return;
            }
            tihuodetids.push(tihuodets[i].data.id);// 将货物放到数组中
          }
        }
      }
      console.log(tihuodetids.length);
      if (tihuodetids.length===0) {
        this.toast.pop('warning', '请选择提货单中的货物！！！');
        return;
      }
      this.tihuoentity.goodsstatus = true;
      this.tihuoentity['tihuodetids'] = tihuodetids;
      if (confirm("请确定提单已经打印并且货物已经实提，你确定吗？")) {
        this.tihuoApi.modifygoodsstatus(this.tihuoentity).then(() => {
          this.toast.pop('success', '货物已经完成提货');
          this.listDetail();
        });
      }
    } else {
      this.toast.pop('warning', '完成或者作废的提单不允许实提操作！');
    }
  };

  

  // 查看已生成的提货单
  print() {
    this.tihuoApi.print(this.route.params['value']['id']).then((response) => {
      if (!response['flag']) {
        this.toast.pop('warning', response['msg']);
        // Notify.alert(response['msg'], { status: 'warning' });
      } else {
        this.listDetail();        
      }
    });
  };
  // 全选按钮
  selectall() {
    this.gridOptions.api.selectAll();
  }
}
