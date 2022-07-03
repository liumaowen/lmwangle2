import { CustomerapiService } from './../../customer/customerapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { OrderapiService } from './../../order/orderapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-salebill',
  templateUrl: './salebill.component.html',
  styleUrls: ['./salebill.component.scss']
})
export class SalebillComponent implements OnInit {

  activating = false;

  querys = { pagenum: 1, pagesize: 10 };

  singleData: any;

  totalItems: any;

  public currentPage: number = 1;

  // 定义type的值
  types = [{ label: '请选择发票类型', value: '' },
  { label: '增值税（普通）发票', value: 0 },
  { label: '增值税（专用）发票', value: 1 }];

  // 定义status的值
  status = [{ label: '请选择发票状态', value: '' },
  { label: '发票开具中', value: 1 },
  { label: '已邮寄', value: 2 },
  { label: '已审核', value: 3 }];

  billgns = [{ label: '全部', value: '' },
  { label: '镀锌板', value: '镀锌板' },
  { label: '热镀锌卷', value: '热镀锌卷' },
  { label: '镀锌卷', value: '镀锌卷' },
  { label: '镀锌钢板', value: '镀锌钢板' },
  { label: '彩涂卷', value: '彩涂卷' },
  { label: '彩涂板', value: '彩涂板' },
  { label: '彩钢卷', value: '彩钢卷' },
  { label: '彩钢板', value: '彩钢板' },
  { label: '镀铝锌光板', value: '镀铝锌光板' },
  { label: '镀铝锌板', value: '镀铝锌板' },
  { label: '镀铝锌卷', value: '镀铝锌卷' }]; // 定义发票品名

  sellers;

  companyOfName;

  suser;

  constructor(private orderApi: OrderapiService, private customerApi: CustomerapiService) {
    this.listDetail();
  }

  listDetail() {
    this.orderApi.pageSalebill(this.querys).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.singleData = data.json();
    });
  }

  // 分页点击查询
  pageChanged(event: any): void {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.listDetail();
  };

  // 启动查询对话框
  queryDialog() {
    this.selectNull();
    this.customerApi.findwiskind().then((data) => {
      const sellerlist = [{ label: '全部', value: '' }];
      console.log(data);
      data.forEach(element => {
        sellerlist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.sellers = sellerlist;
    });
    this.showclassicModal();
  }

  // 查询订单
  query() {
    if (typeof (this.suser) === 'object') {
      this.querys['cuserid'] = this.suser['code'];
    } else {
      this.querys['cuserid'] = '';
    }
    if (typeof (this.companyOfName) === 'object') {
      this.querys['buyerid'] = this.companyOfName['code'];
    } else {
      this.querys['buyerid'] = '';
    }
    this.listDetail();
    this.hideclassicModal();
  };

  selectNull() {
    this.querys = { pagenum: 1, pagesize: 10 };
    this.suser = undefined;
    this.companyOfName = undefined;
  }

  ngOnInit() {
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
