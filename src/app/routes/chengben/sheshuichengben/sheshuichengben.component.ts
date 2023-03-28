import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { ChengbenService } from '../chengben.service';
import { DatePipe } from '@angular/common';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';

@Component({
  selector: 'app-sheshuichengben',
  templateUrl: './sheshuichengben.component.html',
  styleUrls: ['./sheshuichengben.component.scss']
})
export class SheshuichengbenComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('checkdataModal') private checkdataModal: ModalDirective;
  gridOptions: GridOptions;
  model: Object;
  searchparam: object = { month: '' };
  checkdata = [];
  requestparams = {};
  maxDate = new Date();
  end;

  constructor(public settings: SettingsService, private onechengbenApi: ChengbenService,
    private datepipe: DatePipe, private userapi: UserapiService, private toast: ToasterService,private customerApi: CustomerapiService) {
    //aggird实例对象
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    //设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属公司', field: 'sellername', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '收入', field: 'shouru', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60, enableRowGroup: true,
        cellRenderer: function (params) {
          if (params.data) {
            return params.data.gn;
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3, enableRowGroup: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60,
        enableRowGroup: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '上月库存量', field: 'lastkucunweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['lastkucunweight']) {
            return Number(params.data['lastkucunweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '上月库存单价', field: 'lastkucunprice', minWidth: 60, enableRowGroup: true,
        valueGetter: (params) => {
          if (params.data && params.data['lastkucunprice']) {
            return Number(params.data['lastkucunprice']);
          } else {
            return 0;
          }
        }, 
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '上月库存金额', field: 'lastkucunjine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['lastkucunjine']) {
            return Number(params.data['lastkucunjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月进货量', field: 'benjinhuoweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['benjinhuoweight']) {
            return Number(params.data['benjinhuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月进货单价', field: 'benjinhuoprice', minWidth: 60, enableRowGroup: true,
        valueGetter: (params) => {
          if (params.data && params.data['benjinhuoprice']) {
            return Number(params.data['benjinhuoprice']);
          } else {
            return 0;
          }
        }, 
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月进货金额', field: 'benjinhuojine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['benjinhuojine']) {
            return Number(params.data['benjinhuojine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月加工量', field: 'produceweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['produceweight']) {
            return Number(params.data['produceweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月加工成本单价', field: 'producechengben', minWidth: 60, enableRowGroup: true,
        valueGetter: (params) => {
          if (params.data && params.data['producechengben']) {
            return Number(params.data['producechengben']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月加工成本金额', field: 'producejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['producejine']) {
            return Number(params.data['producejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月进货估价量', field: 'benjinyuguweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['benjinyuguweight']) {
            return Number(params.data['benjinyuguweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月进货估价单价', field: 'benjinyuguprice', minWidth: 60, enableRowGroup: true,
        valueGetter: (params) => {
          if (params.data && params.data['benjinyuguprice']) {
            return Number(params.data['benjinyuguprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月进货估价金额', field: 'benjinyugujine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['benjinyugujine']) {
            return Number(params.data['benjinyugujine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售量', field: 'saleweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['saleweight']) {
            return Number(params.data['saleweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售单价', field: 'saleprice', minWidth: 60, enableRowGroup: true,
        valueGetter: (params) => {
          if (params.data && params.data['saleprice']) {
            return Number(params.data['saleprice']);
          } else {
            return 0;
          }
        }, 
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售收入', field: 'xsshouru', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xsshouru']) {
            return Number(params.data['xsshouru']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售成本', field: 'xschengben', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xschengben']) {
            return Number(params.data['xschengben']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '毛利金额', field: 'maolijine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['maolijine']) {
            return Number(params.data['maolijine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '吨毛利', field: 'maoliweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['maoliweight']) {
            return Number(params.data['maoliweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月库存量', field: 'kucunweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucunweight']) {
            return Number(params.data['kucunweight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月库存金额', field: 'kucunjine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucunjine']) {
            return Number(params.data['kucunjine']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '数量检查', field: 'countcheck', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['countcheck']) {
            return Number(params.data['countcheck']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '金额检查', field: 'jinecheck', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jinecheck']) {
            return Number(params.data['jinecheck']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '利润检查', field: 'liruncheck', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['liruncheck']) {
            return Number(params.data['liruncheck']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },


    ];
    this.getMyRole();
  }
  ngOnInit() {
    
  }
  orderstart: Date;
  orderend: Date;
    // 卖方公司
    innercompany(event) {
      this.requestparams['sellerid'] = event;
    }
  search() {
    if (this.orderstart){
      this.requestparams['orderstart'] = this.datepipe.transform(this.orderstart, 'y-MM-dd');
    }else{
      this.toast.pop('warning', '请选择开始时间！');
      return;
    }
    if (this.orderend) {
      this.requestparams['orderend'] = this.datepipe.transform(this.orderend, 'y-MM-dd');
    }else{
      this.toast.pop('warning', '请选择结束时间！');
      return;
    }
    this.onechengbenApi.listsheshuichengben(this.requestparams).then(data => {
      this.gridOptions.api.setRowData(data);
      this.close();
    });
  }

  modifyLastkucun(params, isjine) {
    console.log(params);
    const id = params.data.id;
    this.model = null;
    if (isjine) {
      this.model = { isjine: isjine, lastkucunjine: params.newValue };
    } else {
      this.model = { isjine: isjine, lastkucunweight: params.newValue };
    }

    this.onechengbenApi.modifyLastkucun(id, this.model).then(data => {
    });
  }
    //查询采购单位
    companyIsWiskind = []
    findWiskind() {
      if (this.companyIsWiskind.length < 1) {
        this.companyIsWiskind.push({ label: '请选择卖方单位', value: '' });
        this.customerApi.findwiskind().then((response) => {
          for (let i = 1; i < response.length; i++) {
            if (response[i].id === 3453) {
              response.splice(i, 1);
            }
          }
          response.forEach(element => {
            if (element.id === 3786 ||
              element.id === 3864 ||
              element.id === 21619
            ) {
              this.companyIsWiskind.push({
                label: element.name,
                value: element.id
              });
            }
          });
        });
      }
    }
  openquery() {
    this.selectNull();
    this.findWiskind();
    this.classicModal.show();
  }
  selectNull() {
    this.searchparam = { month: '' };
  }
  close() {
    this.classicModal.hide();
  }
  selectmonth(value) {
    this.searchparam['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  // 查询检查数据显示
  getcheckdata() {
   if(confirm('你确定要生成数据吗？？？')){
    if (this.orderstart) this.requestparams['orderstart'] = this.datepipe.transform(this.orderstart, 'y-MM-dd');
    if (this.orderend) this.requestparams['orderend'] = this.datepipe.transform(this.orderend, 'y-MM-dd');
    this.onechengbenApi.getcheckdatasheshui(this.requestparams).then(data => {
      //this.checkdata = data;
    });
    this.checkdataclose();
   }
  }
  checkdatashow() {
    //this.getcheckdata();
    this.checkdataModal.show();
  }
  checkdataclose() {
    this.checkdataModal.hide();
  }
  isadmain = false;
  getMyRole() {
    let myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      if (myrole[i] === 1) {
        this.isadmain = true;
      }
    }
  }

}
