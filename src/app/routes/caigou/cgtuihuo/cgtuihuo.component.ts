import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { ModalDirective } from 'ngx-bootstrap';
import { CustomerapiService } from './../../customer/customerapi.service';

@Component({
  selector: 'app-cgtuihuo',
  templateUrl: './cgtuihuo.component.html',
  styleUrls: ['./cgtuihuo.component.scss']
})
export class CgtuihuoComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 时序表格的数据
  cgtuihuoData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  // 查询数据
  search: object= { pagenum: 1, pagesize: 10, type: '', billno: '', supplierid: '', cuserid: '' };
  statusdet: any;
  // 分页点击查询数据
  pageChanged(event) {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.querydata();
  }
  constructor(private caigouApi: CaigouService,private customerApi: CustomerapiService, ) {
    this.querydata();
  }

  ngOnInit() {
  }
  // 查询时序表数据
  querydata() {
    if (this.search['supplierid'] instanceof Object) {
      this.search['supplierid'] = this.search['supplierid'].code;
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    this.caigouApi.querytuihuo(this.search).then(data => {
      console.log('data', data);
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.cgtuihuoData = data.json();
    });
  }
  selectNull() {
    this.search = {pagenum: 1, pagesize: 10, type: '', billno: '', supplierid: '', cuserid: ''};
  }
  // 弹出查询弹窗
  showDialog() {
    this.selectNull();
    this.statusdet = [{id: '1', text: '待审核'}, {id: '2', text: '已审核'}];
    this.findWiskind();
    this.classicModal.show();
  }
  selectestatus(value) {
    this.search['status'] = value.id;
  }
  hideDialog() {
    this.classicModal.hide();
  }
  // 查询
  query() {
    console.log(this.search);
    this.querydata();
    this.hideDialog();
  }

   //查询采购单位
   companyIsWiskind = []
   findWiskind() {
     if (this.companyIsWiskind.length < 1) {
       this.companyIsWiskind.push({ label: '请选择卖方单位', value: '' })
       this.customerApi.findwiskind().then((response) => {
         for (let i = 1; i < response.length; i++) {
           if (response[i].id === 3453) {
             response.splice(i, 1);
           }
         }
         response.forEach(element => {
           this.companyIsWiskind.push({
             label: element.name,
             value: element.id
           })
         });
         console.log(this.companyIsWiskind);
         // this.companyIsWiskind = response;
       })
     }
   }

}
