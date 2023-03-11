import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionapiService } from './questionapi.service';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { SelectComponent } from 'ng2-select';
import { DatePipe } from '@angular/common';
import { OrgApiService } from 'app/dnn/service/orgapi.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  model: any = {};
  answer: Answer[];
  // 总条目
  totalItems: any;
  // 表格数据
  singleData: any = [];
  updateData: any = {};
  isupdate = false;
  querys: any = { pageNum: 1, pageSize: 10 };
  start: any;
  end: any;
  orgs = [];
  cuser: any = {};
  vuser: any = {};
  maxDate = new Date();
  public currentPage = 1;
  questiontypes: any = [{ value: 0, label: '单选题' },
  { value: 1, label: '多选题' }, { value: 2, label: '判断题' }];
  answers: any = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' },
  { label: 'C', value: 'C' }, { label: 'D', value: 'D' }];
  levels: any = [{ value: 0, label: '易' }, { value: 1, label: '难' }];
  yhide: any = [{ value: true, label: '是' }, { value: false, label: '否' }];
  questiontypesQuery: any = [{ value: '', label: '请选择' }, { value: 0, label: '单选题' },
  { value: 1, label: '多选题' }, { value: 2, label: '判断题' }];
  yhideQuery: any = [{ value: '', label: '请选择' }, { value: false, label: '启用' }, { value: true, label: '隐藏' }];
  // 题干类型
  titletypes = [];
  isall = false; // 是否全选
  @ViewChild('createModal') private createModal: ModalDirective;
  @ViewChild('queryModal') private queryModal: ModalDirective;
  @ViewChild('defaultQuestiontype') private defaultQuestiontype: SelectComponent;
  @ViewChild('defaultLevel') private defaultLevel: SelectComponent;
  constructor(
    private questionApi: QuestionapiService,
    private toast: ToasterService,
    private router: Router,
    private datePipe: DatePipe,
    private orgApi: OrgApiService,
  ) { }

  ngOnInit() {
    this.listDetail();
    this.getTitletypes();
    this.getorgs();
  }
  /**查询列表 */
  listDetail() {
    this.questionApi.query(this.querys).then(data => {
      if (this.querys['type'] === null || this.querys['type'] === undefined) {
        // 获取到总条目
        this.totalItems = data.json()['total'];
        // 获取到当前数据
        this.singleData = data.json()['list'];
      } else if (this.querys['type'] === 2) {
        window.open(data.json().url);
      } else if (this.querys['type'] === 3 || this.querys['type'] === 4) {
        this.querys['type'] = undefined;
        this.listDetail();
      }
    });
  }
  importQuestions() {
    this.questionApi.query(this.querys).then(data => {
      if (this.query['type'] === 2 && data) {
        window.open(data.json().url);
      } else if (this.query['type'] === 3 && data) {
        this.hidequeryModal();
      }
    });
  }

  // 获取题干类型
  getTitletypes() {
    this.questionApi.getTitletypes().then(data => {
      if (data) {
        this.titletypes = data;
      }
    });
  }

  /**获取机构 */
  getorgs() {
    this.orgs = [{ value: '', label: '全部' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          value: element.id,
          label: element.name
        });
      });
    });
  }

  // 分页点击查询
  pageChanged(event: any): void {
    this.querys['pageNum'] = event.page;
    this.querys['pageSize'] = event.itemsPerPage;
    this.listDetail();
  }
  /**查询弹窗 */
  queryDialog() {
    // this.getorgs();
    delete this.querys['title'];
    this.start = '';
    this.end = '';
    this.vuser = {};
    this.cuser = {};
    delete this.querys['start'];
    delete this.querys['end'];
    this.query['orgid'] = '';
    this.querys['titletype'] = '';
    this.querys['yhide'] = '';
    this.querys['questiontype'] = '';
    this.querys['type'] = undefined;
    this.queryModal.show();
  }
  /**关闭查询弹窗 */
  hidequeryModal() {
    this.queryModal.hide();
  }
  /**查询确定 */
  query(type) {
    if (this.start) {
      this.querys.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    } else {
      this.querys.start = '';
    }
    if (this.end) {
      this.querys.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    } else {
      this.querys.end = '';
    }
    this.querys['pageNum'] = 1;
    this.querys['type'] = type;
    if (typeof (this.cuser) === 'string' || !this.cuser) {
      this.querys['cuserid'] = '';
    } else if (typeof (this.cuser) === 'object') {
      this.querys.cuserid = this.cuser['code'];
    }
    if (typeof (this.vuser) === 'string' || !this.vuser) {
      this.querys['vuserid'] = '';
    } else if (typeof (this.vuser) === 'object') {
      this.querys.vuserid = this.vuser['code'];
    }
    this.listDetail();
    this.hidequeryModal();
  }
  /**打开创建弹窗 */
  createDialog() {
    this.vuser = {};
    this.model = {};
    this.createModal.show();
    this.answers = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' },
    { label: 'C', value: 'C' }, { label: 'D', value: 'D' }];
    this.model['questiontype'] = 0;
    this.model['yhide'] = false;
    this.model['level'] = 0;
    this.answer = null;
    this.isupdate = false;
  }
  /**关闭创建弹窗 */
  hidecreateModal() {
    this.createModal.hide();
  }
  /**创建 */
  addQuestion() {
    if (!this.model['title']) {
      this.toast.pop('warning', '请填写题干');
      return;
    }
    this.model['title'] = this.model['title'].trim();
    if (!this.model['optiona']) {
      this.toast.pop('warning', '请填写选项A');
      return;
    }
    if (!this.model['optionb']) {
      this.toast.pop('warning', '请填写选项B');
      return;
    }
    if (!this.model['optionc'] && this.model['questiontype'] !== 2) {
      this.toast.pop('warning', '请填写选项C');
      return;
    }
    if (!this.model['optiond'] && this.model['questiontype'] !== 2) {
      this.toast.pop('warning', '请填写选项D');
      return;
    }
    if ((this.model['questiontype'] === 1) && this.answer && typeof (this.answer) === 'object') {
      this.model['answer'] = this.answer.join('');
      this.model['answer'] = Array.from(this.model['answer']).sort().join('');
    }
    if (!this.model['answer']) {
      this.toast.pop('warning', '请选择正确答案');
      return;
    }
    if (!this.model['titletype']) {
      this.toast.pop('warning', '请选择题干类型');
      return;
    }
    if (this.model['yhide'] === null || this.model['yhide'] === undefined) {
      this.toast.pop('warning', '请选择状态');
      return;
    }
    if (typeof (this.vuser) === 'string' || !this.vuser) {
      this.toast.pop('warning', '请选择负责人');
      return;
    } else if (typeof (this.vuser) === 'object') {
      this.model['vuserid'] = this.vuser['code'];
    }
    // if (this.model['orgid'] === null || this.model['orgid'] === undefined) {
    //   this.toast.pop('warning', '请选择负责机构');
    //   return;
    // }
    if (this.isupdate) {
      this.questionApi.update(this.model).then(data => {
        this.listDetail();
        this.hidecreateModal();
      });
    } else {
      this.questionApi.create(this.model).then(data => {
        this.querys['pageNum'] = 1;
        delete this.querys['title'];
        delete this.querys['start'];
        delete this.querys['end'];
        this.listDetail();
        this.hidecreateModal();
      });
    }
  }
  /**删除 */
  del(id) {
    if (confirm('确定删除该试题吗？')) {
      this.questionApi.delete(id).then(data => {
        this.listDetail();
      });
    }
  }
  /**打开更新弹窗 */
  update(data) {
    this.updateData = JSON.parse(JSON.stringify(data));
    this.model = this.updateData;
    this.createModal.show();
    this.isupdate = true;
    this.answers = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' },
    { label: 'C', value: 'C' }, { label: 'D', value: 'D' }];
    if (this.model['questiontype'] === 1) {
      this.answer = this.model['answer'].split('');
    } else if (this.model['questiontype'] === 2) {
      this.answers = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }];
    }
  }
  /**选择试题类型 */
  selectetype() {
    const answers: any = [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' },
    { label: 'C', value: 'C' }, { label: 'D', value: 'D' }];
    this.model['answer'] = null;
    if (this.model['questiontype'] === 0) {
      this.answers = answers;
    } else if (this.model['questiontype'] === 1) {
      this.answer = [];
      this.answers = answers;
    } else if (this.model['questiontype'] === 2) {
      delete this.model['optionc'];
      delete this.model['optiond'];
      delete this.model['answer'];
      this.answers = JSON.parse(JSON.stringify(answers.slice(0, 2)));
    }
  }
  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;

  // 入库单上传弹窗
  questionUploader() {
    this.uploaderModel.show();
  }

  // 试题上传信息及格式
  uploadParam: any = { module: 'question', count: 1, sizemax: 1, extensions: ['xls'] };

  // 设置上传的格式
  accept = ".xls, application/xls";

  // 上传成功执行的回调方法
  uploads($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.questionApi.batchupload(addData).then(data => {
        this.querys['pageNum'] = 1;
        delete this.querys['title'];
        delete this.querys['start'];
        delete this.querys['end'];
        this.listDetail();
        this.toast.pop('success', '上传成功！');
      });
    }
    this.listDetail();
    this.hideDialog();
  }

  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }
  /**下载模板 */
  downExcel() {
    this.questionApi.downloadexcel().then(data => {
      this.toast.pop('success', '下载成功！');
    });
  }
  checkboxchange(event) {
    const isnotall = this.singleData.some(item => !item.checked);
    if (isnotall) {
      this.isall = false;
    } else {
      this.isall = true;
    }
  }
  /**全选 */
  allcheck() {
    if (this.isall) {
      this.singleData.forEach(item => {
        item.checked = false;
      });
    } else {
      this.singleData.forEach(item => {
        item.checked = true;
      });
    }
    const isnotall = this.singleData.some(item => !item.checked);
    if (isnotall) {
      this.isall = false;
    } else {
      this.isall = true;
    }
  }
  // 开启、隐藏试题
  hideQuestions(yhide) {
    const questionids = [];
    this.singleData.forEach(item => {
      if (item.checked && item.id) {
        questionids.push(item.id);
      }
    });

    if (questionids.length) {
      this.questionApi.hideQuestions({ questionids: questionids, yhide: yhide }).then(data => {
        if (data) {
          this.listDetail();
        }
      });
    } else {
      this.toast.pop('warning', '请选择试题！');
    }
  }
}
export class Answer {
  label: string;
  value: string;
}
