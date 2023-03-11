import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AllotapiService } from '../../allotapi.service';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap';
const sweetalert = require('sweetalert');

@Component({
  selector: 'app-tihuoren',
  templateUrl: './tihuoren.component.html',
  styleUrls: ['./tihuoren.component.scss']
})
export class TihuorenComponent implements OnInit {
  tihuoForm: FormGroup;
  params: any = {};
  // 接收父页面this对象
  parentthis;
  constructor(
    private fb: FormBuilder,
    private allotapi: AllotapiService,
    private toast: ToasterService,
    public bsModalRef: BsModalRef
  ) {
    this.tihuoForm = fb.group({
      'chehao': [null, Validators.compose([Validators.required, Validators.pattern('^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$')])],
      'siji': [null, Validators.compose([Validators.required, Validators.pattern('^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$')])],
      'sijitel': [null, Validators.compose([Validators.required, Validators.pattern('1[3|5|7|8|][0-9]{9}')])],
      'beizhu': [null, Validators.compose([])],
      'sijiid': [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/)])]
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.params = JSON.parse(JSON.stringify(this.parentthis.model));
    }, 0);
  }
  // 提交修改的提货人信息
  submittihuo() {
    sweetalert({
      title: '你确定要将保存修改吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.allotapi.modifytihuo(this.params).then(() => {
        this.toast.pop('success', '提货人信息修改成功!');
        this.parentthis.closetihuorenmodal();
      });
      sweetalert.close();
    });
  }
}
