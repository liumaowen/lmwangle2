import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { GridOptions } from 'ag-grid/main';
import { DatePipe } from '@angular/common';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-qihuojiedanhuizong',
  templateUrl: './qihuojiedanhuizong.component.html',
  styleUrls: ['./qihuojiedanhuizong.component.scss']
})
export class QihuojiedanhuizongComponent implements OnInit {
  gridOptions: GridOptions;
  search: any = { start: null, end: null };
  @ViewChild('qihuohuizong') private qihuohuizong: ModalDirective;

  constructor(public settings: SettingsService, private datepipe: DatePipe, private qhuoApi: QihuoService, private toast: ToasterService) {
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
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '山东服务中心', field: 'sdone', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['sdone']) {
            return Number(params.data['sdone']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '山东配送中心', field: 'sdtwo', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['sdtwo']) {
            return Number(params.data['sdtwo']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '天津配送中心', field: 'sdthree', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['sdthree']) {
            return Number(params.data['sdthree']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '上海服务中心', field: 'shhone', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['shhone']) {
            return Number(params.data['shhone']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '上海配送中心', field: 'shhtwo', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['shhtwo']) {
            return Number(params.data['shhtwo']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宁波服务中心', field: 'shhoffice', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['shhoffice']) {
            return Number(params.data['shhoffice']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '成都服务中心', field: 'cdwiskind', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['cdwiskind']) {
            return Number(params.data['cdwiskind']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '佛山服务中心', field: 'fswiskind', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['fswiskind']) {
            return Number(params.data['fswiskind']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '创新中心', field: 'shhcenter', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['shhcenter']) {
            return Number(params.data['shhcenter']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '涂镀应用艺术', field: 'tudu', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tudu']) {
            return Number(params.data['tudu']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '资源中心', field: 'zyproject', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['zyproject']) {
            return Number(params.data['zyproject']);
          } else {
            return '';
          }
        }
      },
    //   {
    //     cellStyle: { 'text-align': 'center' }, headerName: '资源中心-材料', field: 'zycailiao', minWidth: 90, aggFunc: 'sum',
    //     valueGetter: (params) => {
    //       if (params.data && params.data['zycailiao']) {
    //         return Number(params.data['zycailiao']);
    //       } else {
    //         return '';
    //       }
    //     }
    //   },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '要客服务中心', field: 'yaokeservice', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yaokeservice']) {
            return Number(params.data['yaokeservice']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '运营中心', field: 'operationcenter', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['operationcenter']) {
            return Number(params.data['operationcenter']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '项目开发部', field: 'projectkaifa', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['projectkaifa']) {
            return Number(params.data['projectkaifa']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重庆服务中心', field: 'cqfuwu', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['cqfuwu']) {
            return Number(params.data['cqfuwu']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '武汉服务中心', field: 'whfuwu', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['whfuwu']) {
            return Number(params.data['whfuwu']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '行业开发二部', field: 'hykaifa', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['hykaifa']) {
            return Number(params.data['hykaifa']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '邯郸加工中心', field: 'hdjiagong', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['hdjiagong']) {
            return Number(params.data['hdjiagong']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '南昌办事处', field: 'ncoffice', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['ncoffice']) {
            return Number(params.data['ncoffice']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '西安办事处', field: 'xaoffice', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xaoffice']) {
            return Number(params.data['xaoffice']);
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月合计', field: 'jiedan', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jiedan']) {
            return Number(params.data['jiedan']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '上月合计', field: 'lastjiedan', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['lastjiedan']) {
            return Number(params.data['lastjiedan']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '环比上月', field: 'rate', minWidth: 90
      }



    ];

  }

  ngOnInit() {
    this.listDetail();
  }
  //获取数据
  listDetail() {
    let date = new Date();
    if (!this.search['start']) {
      this.search['start'] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01';
    }
    if (!this.search['end']) {
      this.search['end'] = date;
    }
    if (this.search['start']) {
      this.search['start'] = this.datepipe.transform(this.search['start'], 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.search['end'], 'y-MM-dd');
    }
    this.qhuoApi.qihuojiedanhuizong(this.search).then(data => {
      data.forEach(element => {
        if (element.lastjiedan) {
          element.rate = element.jiedan / element.lastjiedan;
          element.rate = (element.rate * 100).toFixed(2);
          element.rate = element.rate + '%';
        }
        element.jiedan = (element.jiedan * 1).toFixed(3);
        element.lastjiedan = (element.lastjiedan * 1).toFixed(3);
      })
      this.gridOptions.api.setRowData(data);
    });
  }
  //查询对话框
  openquery() {
    this.qihuohuizong.show();
  }
  close() {
    this.qihuohuizong.hide();
  }
  select() {
    this.listDetail();
    this.close();
  }

}
