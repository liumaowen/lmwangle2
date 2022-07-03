import { CgbuchaapiService } from './../cgbuchaapi.service';
import { UserapiService } from './../../../dnn/service/userapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { CustomerapiService } from './../../customer/customerapi.service';
import { Router } from '@angular/router';
import { Cgorgtypes } from 'app/shared/const';

@Component({
  selector: 'app-cgbucha',
  templateUrl: './cgbucha.component.html',
  styleUrls: ['./cgbucha.component.scss']
})
export class CgbuchaComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  // 时序表格的数据
  cgbuchaData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  // 查询数据
  search: object = { pagenum: 1, pagesize: 10, type: '', billno: '', supplierid: '' };

  // 创建
  create = { type: null, supplierid: null, beizhu: '', sorgid: null, orgid: null };

  // 买方单位
  seller = [{ value: '', label: '全部' }];

  disabled = false;
  types: any[];
  type1s: any[];
  showtype = false;
  orgtypes: any = Cgorgtypes;

  // 分页点击查询数据
  pageChanged(event) {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.querydata();
  }

  constructor(private userApi: UserapiService, private cgbuchaApi: CgbuchaapiService, private router: Router,
    private customerApi: CustomerapiService,
    private toast: ToasterService) {
    this.querydata();
  }

  ngOnInit() {
  }

  // 查询时序表数据
  querydata() {
    if (this.search['supplierid'] instanceof Object) {
      this.search['supplierid'] = this.search['supplierid'].code;
    }
    this.cgbuchaApi.cgbuchalist(this.search).then(data => {
      console.log('cgbucha1', data);
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.cgbuchaData = data.json();
      this.cgbuchaData.forEach(element => {
        if (element.status === 0) {
          element.statusname = '制单中';
        } else if (element.status === 1) {
          element.statusname = '审核中';
        } else if (element.status === 2) {
          element.statusname = '已审核';
        }
      });
    });
  }

  // 弹出查询弹窗
  showDialog() {
    this.selectNull();
    this.findWiskind();
    this.classicModal.show();
  }

  // 关闭查询弹窗
  hideDialog() {
    this.classicModal.hide();
  }

  // 重置查询条件
  selectNull() {
    this.search = { pagenum: 1, pagesize: 10, type: '', billno: '', supplierid: '' };
  }

  // 查询
  query() {
    console.log(this.search);
    this.querydata();
    this.hideDialog();
  }

  // tslint:disable-next-line:member-ordering
  // 创建补差单的弹窗
  createDialog() {
    this.create = { type: null, supplierid: null, beizhu: '', sorgid: null, orgid: null };
    this.types = [{ id: '0', text: '采购退款' }, { id: '1', text: '价格调整' }, { id: '2', text: '外购承兑贴息' },
    { id: '3', text: '年底应到未到返利' }, { id: '4', text: '自办承兑贴息' }, { id: '5', text: 'PJ补差' },
    { id: '6', text: '跨月结算价格调整' }, { id: '7', text: '超支借款利息' }];
    this.findWiskind();
    this.createModal.show();
    // if (this.seller.length < 2) {
    //   this.userApi.findwiskind().then(data => {
    //     data.forEach(element => {
    //       this.seller.push({
    //         label: element.name,
    //         value: element.id
    //       });
    //     });
    //   });
    // }
  }

  selectetype(value) {
    this.showtype = false;
    this.create['type'] = value.id;
  }
  // 关闭创建补差弹窗
  closecreateDialog() {
    this.createModal.hide();
  }

  // 新建
  createbucha() {
    if (this.create['type'] === null) {
      this.toast.pop('error', '请选择补差类型！', '');
      return;
    }
    if (this.create['supplierid'] instanceof Object) {
      this.create['supplierid'] = this.create['supplierid'].code;
    } else {
      this.create['supplierid'] = null;
    }
    if (this.create['supplierid'] === null) {
      this.toast.pop('error', '供应商不能为空！', '');
      return;
    }
    if (!this.create['buyerid']) {
      this.toast.pop('error', '采购公司不能为空！', '');
      return;
    }
    if (this.create['orgid'] === null) {
      this.toast.pop('error', '补差机构不能为空！', '');
      return;
    }
    this.cgbuchaApi.createcgbucha(this.create).then(data => {
      console.log('cgbucha', data);
      this.cgbuchaData = data;
      this.router.navigate(['cgbucha', data.id]);
    });
    console.log(this.create);
    this.closecreateDialog();
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
