import { BpricelogapiService } from './../bpricelogapi.service';
import { UserapiService } from './../../../dnn/service/userapi.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bpricelogdateil',
  templateUrl: './bpricelogdateil.component.html',
  styleUrls: ['./bpricelogdateil.component.scss']
})
export class BpricelogdateilComponent implements OnInit {

  // 定义一个详细页面展示的存储对象
  bpricelogmodel = { cuser: {}, vuser: {} };

  // 控制显示提交定价按钮的显示不显示，默认是显示的
  isv = true;

  // 默认可以加备注
  edit = true;

  // 控制显示审核按钮
  vflag = false;

  flag = { verify: false };

  gridOptions: GridOptions;

  bpriceList = new Array();

  constructor(public settings: SettingsService,
    private toast: ToasterService,
    private route: ActivatedRoute,
    private userApi: UserapiService,
    private bpricelogApi: BpricelogapiService,
    private router: Router) {

    this.gridOptions = {
      rowSelection: 'single',
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      rowDeselection: true,
      singleClickEdit: true,
      suppressRowClickSelection: false,
      enableColResize: true,
      onCellValueChanged: (params) => { // 编辑后触发的事件
        // 触发事件后进行价格的调整
        const bprice = {};
        bprice['id'] = params.data.id;
        bprice['diff'] = params.data.diff;
        if (bprice['diff'] > 200) {
          this.toast.pop('warning', '调价价差不能大于200！');
          return;
        }
        for (let i = 0; i < this.bpriceList.length; i++) {
          if (this.bpriceList[i].id == params.data.id) {
            this.bpriceList.splice(i, 1);
          }
        } // 删除重复的
        this.bpriceList.push(bprice);
        params.data.endprice = parseFloat(params.data.price)
          + parseFloat(params.data.diff);
        params.api.refreshView(); // 刷新row
      },
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      }
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 50, suppressMenu: true, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'bprice.gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'bprice.chandi', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '地区', field: 'area', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调价前价格', field: 'price', width: 110 },
      {
        cellStyle: { 'text-align': 'center' }, suppressMenu: true, headerName: '<font color="red">调价幅度</font>',
        field: 'diff', width: 90, editable: true, cellRenderer: (params) => {
          if (0 != this.route.params['value']['id']) { params.colDef.editable = false; }
          if (params.value === null || params.value === undefined) {
            return null;
          } else if (isNaN(params.value)) {
            return 'NaN';
          } else {
            return params.value;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '调价后价格', field: 'endprice', width: 110 },
      {
        headerName: '基础规格', cellStyle: { 'text-align': 'center' },
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houduname', width: 120 },
          { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'widthname', width: 120 },
          { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'ducengname', width: 120 },
          { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhiname', width: 120 }
        ]
      }
    ];


  }

  ngOnInit() {
    this.listBpricelogdet();
  }

  // 给表格中的字段赋值
  listBpricelogdet() {
    if (this.route.params['value']['id'] == 0) { // 判断是不是调价，一个新的调价单的创建，判断传过来的值是否是等于0,进行调价单的创建
      // 回去调价单的单据号
      this.bpricelogmodel['isdel'] = false;
      this.bpricelogmodel['isv'] = false;
      this.edit = true; // 默认可以加备注
      this.userApi.userInfo2().then(data => {
        this.bpricelogmodel['cuser'] = data;
      });
      // $http.get('/api/user/myinfo').success(function (data) {
      //   $scope.bpricelogmodel.cuser = data
      // });
      this.bpricelogmodel['cdate'] = new Date();
      const params = {};
      params['bpriceid'] = JSON.parse(this.route.queryParams['value']['params'])['bpriceids'];
      this.bpricelogApi.getBpriceSelect(params).then((data) => { // 获取选中的将要调价的基价
        console.log(data);
        if (data[0]) {
          for (let i = 0; i < data.length; i++) {
            data[i].bprice = {
              gn: data[i].gn,
              chandi: data[i].chandi,
              comments: data[i].comments,
              duceng: data[i].duceng
            };
          }
        }
        this.gridOptions.api.setRowData(data); // 给网格进行赋值
      });
    } else {// 正常的查看，以及审核人员进行审核的页面,和重新定价页面的数据显示
      this.bpricelogApi.getbpricelogandbpricelogdet(this.route.params['value']['id']).then((resource) => {
        if (this.route.queryParams['value']['params']) {
          this.isv = JSON.parse(this.route.queryParams['value']['params'])['isv'];
        }
        this.vflag = true; // 默认是显示审核按钮的
        this.edit = false; // 不可编辑
        if (resource['bpricelog'].isv) {
          this.vflag = false;
        }// 判断是否审核，如果审核了那么审核的按钮则不显示，没有审核的则显示审核的按钮
        this.bpricelogmodel = resource['bpricelog']; // 给主表信息赋值
        const data = resource['list']; // 获取det的列表数据
        for (let i = 0; i < data.length; i++) {
          data[i].id = data[i].bprice.id;
          data[i].endprice = data[i].price;
          data[i].diff = parseFloat(data[i].price) - parseFloat(data[i].preprice);
          data[i].price = data[i].preprice;
          data[i].area = data[i].bprice.area;
          data[i].houduname = data[i].bprice.houduname;
          data[i].widthname = data[i].bprice.widthname;
          data[i].ducengname = data[i].bprice.ducengname;
          data[i].caizhiname = data[i].bprice.caizhiname;
        }
        this.gridOptions.api.setRowData(data); // 给网格进行赋值
      });
    }
  }

  // 修改完成之后进行提交start
  save() {
    if (this.bpriceList.length > 0) {
      if (confirm('你将要调整‘' + this.bpriceList.length + '’个价格，确定调价吗？')) {
        const paramsData = {};
        paramsData['bpricelog'] = this.bpricelogmodel;
        paramsData['bpricelogDet'] = this.bpriceList;
        this.bpricelogApi.createBpricelog(paramsData).then(() => {
          this.toast.pop('success', '调价成功，请等待领导审核！');
          this.isv = false;
          this.router.navigateByUrl('bprice');
        })
      }
    } else {
      this.toast.pop('warning', '请你调整价格后提交');
    }
  }
  // 修改完成之后进行提交end


  // 审核基价start
  auditBprice() {
    if (confirm('你确定审核吗？')) {
      this.flag.verify = true;
      this.bpricelogApi.auditBprice({ bpricelogid: this.route.params['value']['id'] }).then(() => {
        this.flag.verify = true;
        this.toast.pop('success', '基价审核成功');
        this.router.navigateByUrl('bpricelog');
      });
    }
  }

  // 不同意审核
  notagree() {
    if (confirm('你确定审核吗？')) {
      this.bpricelogApi.notagree({ bpricelogid: this.route.params['value']['id'] }).then(data => {
        this.toast.pop('success', '提交的审核未能通过');
        this.router.navigateByUrl('bpricelog');
      });
    }
  }

  // 返回start
  back() {
    if (this.route.params['value']['id'] == 0) {
      this.router.navigateByUrl('bprice');
    } else {
      this.router.navigateByUrl('bpricelog');
    }
  }

}
