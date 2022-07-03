import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { KucunService } from '../../kucun.service';

@Component({
  selector: 'app-zaitucangku',
  templateUrl: './zaitucangku.component.html',
  styleUrls: ['./zaitucangku.component.scss']
})
export class ZaitucangkuComponent implements OnInit {
  // 接收父页面this对象
  parentthis;
  // 仓库
  ckitems;
  params: any = {};
  flag: number; // 0 修改仓库， 1 修改车船号
  constructor(
    private toast: ToasterService,
    public bsModalRef: BsModalRef,
    private userapi: UserapiService,
    private kucunapi: KucunService
  ) {
    this.getcangku();
  }

  ngOnInit() {
    setTimeout(() => {
      this.flag = this.parentthis.flag;
    }, 0);
  }
  /**获取仓库 */
  getcangku() {
    this.ckitems = [{ value: '', label: '全部' }];
      this.userapi.cangkulist().then(data => {
        data.forEach(element => {
          this.ckitems.push({
            value: element['id'],
            label: element['name']
          });
        });
      });
  }
  /**确定 */
  confirm() {
    if (this.flag) {
      if (!this.params.carshipnum) {
        this.toast.pop('warning', '请输入车船号！');
        return;
      }
    } else {
      if (!this.params.cangkuid) {
        this.toast.pop('warning', '请选择到货仓库！');
        return;
      }
    }
    this.params['detidList'] = this.parentthis.cangkuparams['detids'];
    this.kucunapi.editzaitucangku(this.params).then(data => {
      this.parentthis.closeEditcangku();
    });
  }
}
