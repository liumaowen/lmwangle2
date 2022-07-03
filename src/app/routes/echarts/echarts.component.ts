import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import * as echarts from 'echarts';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { EchartsService } from './echarts.service';
import { SettingsService } from 'app/core/settings/settings.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.scss']
})
export class EchartsComponent implements OnInit {
  orgs: any = [];
  showorg = false; // 查询弹窗是否显示机构
  charttype = null; // 0各机构采购量 1各产地采购量 3各机构出货量
  count = 0;
  datamapvalue = [
    { name: '北京', value: 0 },
    { name: '天津', value: 0 },
    { name: '重庆', value: 0 },
    { name: '上海', value: 0 },
    { name: '湖南', value: 0 },
    { name: '广东', value: 0 },
    { name: '福建', value: 0 },
    { name: '江西', value: 0 },
    { name: '四川', value: 0 },
    { name: '广西', value: 0 },
    { name: '新疆', value: 0 },
    { name: '西藏', value: 0 },
    { name: '青海', value: 0 },
    { name: '甘肃', value: 0 },
    { name: '宁夏', value: 0 },
    { name: '内蒙古', value: 0 },
    { name: '海南', value: 0 },
    { name: '山西', value: 0 },
    { name: '陕西', value: 0 },
    { name: '云南', value: 0 },
    { name: '贵州', value: 0 },
    { name: '湖北', value: 0 },
    { name: '浙江', value: 0 },
    { name: '安徽', value: 0 },
    { name: '河南', value: 0 },
    { name: '山东', value: 0 },
    { name: '江苏', value: 0 },
    { name: '河北', value: 0 },
    { name: '辽宁', value: 0 },
    { name: '吉林', value: 0 },
    { name: '黑龙江', value: 0 },
    { name: '台湾', value: 0 },
    { name: '香港', value: 0 },
    { name: '澳门', value: 0 },
  ];
  @ViewChild('pieEchartOrg') pieEchartOrg: ElementRef;
  @ViewChild('pieEchartChandi') pieEchartChandi: ElementRef;
  @ViewChild('pieEchartTudu') pieEchartTudu: ElementRef;
  @ViewChild('barEchartOrg') barEchartOrg: ElementRef;
  @ViewChild('barEchartGn') barEchartGn: ElementRef;
  @ViewChild('mapEchart') mapEchart: ElementRef;
  barEchartsOrgInstance: any;
  barEchartsGnInstance: any;
  pieEchartsInstance: any;
  pieEchartChandiInstance: any;
  pieEchartTuduInstance: any;
  mapEchartsInstance: any;
  // 开始时间
  start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值
  end = new Date();
  maxDate = new Date();
  params: any = {}; // 查询参数
  @ViewChild('classicModal') private classicModal: ModalDirective;
  constructor(private http: Http,
    private numberpipe: DecimalPipe,
    private datepipe: DatePipe,
    private echartsService: EchartsService,
    public settings: SettingsService,
    private orgApi: OrgApiService,
    private toast: ToasterService) {
  }
  ngOnInit() {
    this.getPie();
    this.getorg();
    this.getPieTudu();
    this.getBarOrgTihuo();
    // this.liveUpdate();
    this.getBarGnTihuo();
    this.getMapAreaTihuo();
    // 页面监听
    Observable.fromEvent(window, 'resize')
      .debounceTime(200) // 以免频繁处理
      .subscribe((event) => {
        if (this.pieEchartChandiInstance) {
          this.pieEchartChandiInstance.resize();
        }
        if (this.pieEchartsInstance) {
          this.pieEchartsInstance.resize();
        }
        if (this.pieEchartTuduInstance) {
          this.pieEchartTuduInstance.resize();
        }
        if (this.barEchartsOrgInstance) {
          this.barEchartsOrgInstance.resize();
        }
        if (this.barEchartsGnInstance) {
          this.barEchartsGnInstance.resize();
        }
        if (this.mapEchartsInstance) {
          this.mapEchartsInstance.resize();
        }
      });
  }
  /**获取圆饼图各机构数据 */
  getPie() {
    this.params.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.params.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.params.orgid = '';
    this.pieEchartsInstance = echarts.init(this.pieEchartOrg.nativeElement);
    this.pieEchartsInstance.showLoading();
    const pieparams: any = { type: 0 };
    this.echartsService.getPie(this.params).then(piedata => {
      pieparams.data = piedata;
      pieparams.text = this.params.start + '~' + this.params.end;
      pieparams.savename = pieparams.text + '各机构采购量';
      this.pieEchartsInstance.hideLoading();
      this.piechartInit(pieparams, this.pieEchartsInstance);
    });
  }
  /**获取涂镀公司采购数据 */
  getPieTudu() {
    this.params.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.params.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.params.orgid = '';
    this.pieEchartTuduInstance = echarts.init(this.pieEchartTudu.nativeElement);
    this.pieEchartTuduInstance.showLoading();
    const pieparams: any = { type: 2 };
    this.echartsService.getPieTudu(this.params).then(piedata => {
      pieparams.data = piedata;
      pieparams.text = this.params.start + '~' + this.params.end;
      pieparams.savename = pieparams.text + '涂镀公司采购量';
      this.pieEchartTuduInstance.hideLoading();
      this.piechartInit(pieparams, this.pieEchartTuduInstance);
    });
  }
  /**获取圆饼图某机构各产地数据 */
  getPieChandi() {
    this.params.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.params.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.pieEchartChandiInstance = echarts.init(this.pieEchartChandi.nativeElement);
    this.pieEchartChandiInstance.showLoading();
    const pieparams: any = { type: 1 };
    this.echartsService.getPieChandi(this.params).then(piedata => {
      pieparams.data = piedata;
      pieparams.text = this.params.start + '~' + this.params.end;
      if (piedata.length) {
        pieparams.text = this.params.start + '~' + this.params.end + ' ' + piedata[0].orgname;
      }
      pieparams.savename = pieparams.graphictext + '各产地采购量';
      this.pieEchartChandiInstance.hideLoading();
      this.piechartInit(pieparams, this.pieEchartChandiInstance);
    });
  }
  /**获取柱状图各机构出货数据 */
  getBarOrgTihuo() {
    // this.params.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.params.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.params.orgid = '';
    this.barEchartsOrgInstance = echarts.init(this.barEchartOrg.nativeElement);
    this.barEchartsOrgInstance.showLoading();
    const barparams: any = { type: 3 };
    this.echartsService.getBarOrg(this.params).then(piedata => {
      barparams.data = piedata;
      barparams.rotate = 30;
      barparams.graphictext = this.params.start + '~' + this.params.end;
      barparams.savename = barparams.graphictext + '各机构出货量';
      this.barEchartsOrgInstance.hideLoading();
      this.barchartInit(barparams, this.barEchartsOrgInstance);
    });
  }
  /**获取柱状图各品种出货数据 */
  getBarGnTihuo() {
    this.params.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.params.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.params.orgid = '';
    this.barEchartsGnInstance = echarts.init(this.barEchartGn.nativeElement);
    this.barEchartsGnInstance.showLoading();
    const barparams: any = { type: 4 };
    this.echartsService.getBarGn(this.params).then(piedata => {
      barparams.data = piedata;
      barparams.rotate = 0;
      barparams.graphictext = this.params.start + '~' + this.params.end;
      barparams.savename = barparams.graphictext + '各品种出货量';
      this.barEchartsGnInstance.hideLoading();
      this.barchartInit(barparams, this.barEchartsGnInstance);
    });
  }
  /**获取地图各区域出货数据 */
  getMapAreaTihuo() {
    this.params.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.params.end = this.datepipe.transform(this.end, 'y-MM-dd');
    delete this.params.orgid;
    this.mapEchartsInstance = echarts.init(this.mapEchart.nativeElement);
    this.mapEchartsInstance.showLoading();
    const mapparams: any = { type: 5 };
    this.echartsService.getMapArea(this.params).then(mapdata => {
      // const mapdatadefault = JSON.parse(JSON.stringify(this.datamapvalue));
      // mapdatadefault.forEach(item => {
      //   mapdata.forEach(ele => {
      //     if (ele.name === item.name) {
      //       if (ele.value > 0) {
      //         item.value = ele.value;
      //       }
      //     }
      //   });
      // });
      let linshi = [];
      linshi = mapdata;
      let max = 0, min = 0, total = 0;
      if (mapdata.length) {
        max = linshi[0].value;
        min = linshi[0].value;
      }
      for (let i = 0; i < linshi.length; i++) {
        const cur = linshi[i].value;
        max = max < cur ? cur : max;
        min = cur < min ? cur : min;
        total += cur;
      }
      mapparams.data = mapdata;
      mapparams.min = min;
      mapparams.max = max;
      mapparams.graphictext = this.params.start + '~' + this.params.end + ' 共' + this.numberpipe.transform(total, '1.0-3') + '吨';
      mapparams.savename = mapparams.graphictext + '各区域出货量';
      this.mapEchartsInstance.hideLoading();
      this.mapchartInit(mapparams, this.mapEchartsInstance);
    });
  }
  /**获取机构 */
  getorg() {
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          value: element.id,
          label: element.name
        });
      });
      this.params.orgid = this.orgs[0].value;
      this.getPieChandi();
    });
  }
  /**初始化柱状图参数 */
  barchartInit(params, barchart) {
    const color = ['#4f81bd'], names = [], values = [];
    let total = 0;
    params.data.forEach(element => {
      names.push(element.name);
      values.push(element.value);
      total += Number(element.value);
    });
    const optionBar = {
      baseOption: {
        color: color,
        title: {
          text: params.graphictext + ' 共' + this.numberpipe.transform(total, '1.0-3') + '吨'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        dataZoom: [ // 滚轮缩放
          {
            type: 'inside'
          }
        ],
        toolbox: {
          show: true,
          feature: {
            myTool1: {
              show: true,
              title: '查询',
              // tslint:disable-next-line:max-line-length
              icon: 'path://M883.626667 823.04l-145.066667-144.64A337.92 337.92 0 0 0 810.666667 469.333333a341.333333 341.333333 0 1 0-341.333334 341.333334 337.92 337.92 0 0 0 209.066667-72.106667l144.64 145.066667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667zM213.333333 469.333333a256 256 0 1 1 256 256 256 256 0 0 1-256-256z',
              onclick: () => {
                this.show(params.type);
              }
            },
            saveAsImage: {
              show: true,
              name: params.savename,
              pixelRatio: 1.3
            }
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: names,
            axisLabel: {
              interval: 0,
              rotate: params.rotate,
              fontSize: 14
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'bar',
            data: values,
            label: {
              normal: {
                show: true,
                position: 'top',
                color: '#000',
                formatter: (params1) => {
                  const value = this.numberpipe.transform(params1.value, '1.0-3');
                  return `${value}`;
                },
                z: 10
              },
            },
          }
        ]
      },
      media: [
        // {
        //   query: {
        //     maxWidth: 500
        //   },
        //   option: {
        //     xAxis: [
        //       {
        //         type: 'category',
        //         data: names,
        //         axisLabel: {
        //           interval: 0,
        //           rotate: params.rotate,
        //           fontSize: 12
        //         }
        //       }
        //     ],
        //   }
        // }
      ]


    };
    barchart.setOption(optionBar);
  }
  /**
   * 初始化圆饼图参数
   * @param params {type:圆饼图的类型,data:数据,text:标题}
   * @param piechart
   */
  piechartInit(params, piechart) {
    let names = [], total = 0;
    params.data.forEach(element => {
      names.push(element.name);
      total += element.value;
    });
    const color = ['#76e083', '#ff9021', '#66a2d8', '#b2e852', '#66ffff', '#a5a5a5', '#ff3333', '#706a6a', '#ffc000',
      '#c23531', '#2f4554', '#61a0a8', '#d48265'];
    const optionPie = {
      baseOption: {
        color: color,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        toolbox: {
          show: true,
          feature: {
            myTool1: {
              show: true,
              title: '查询',
              // tslint:disable-next-line:max-line-length
              icon: 'path://M883.626667 823.04l-145.066667-144.64A337.92 337.92 0 0 0 810.666667 469.333333a341.333333 341.333333 0 1 0-341.333334 341.333334 337.92 337.92 0 0 0 209.066667-72.106667l144.64 145.066667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667zM213.333333 469.333333a256 256 0 1 1 256 256 256 256 0 0 1-256-256z',
              onclick: () => {
                this.show(params.type);
              }
            },
            saveAsImage: {
              show: true,
              name: params.savename,
              pixelRatio: 1.3
            }
          },
        },
        // legend: {
        //   data: names
        // },
        series: [
          {
            name: '各机构期货采购量',
            type: 'pie',
            // radius: ['40%', '60%'],
            // avoidLabelOverlap: false,
            emphasis: {
              label: {
                formatter: '{b}: {d}',
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            label: {
              normal: {
                show: true,
                // position: 'center',
                formatter: '{b}: {c} ({d}%)',
                textStyle: {
                  fontSize: 16,
                  color: '#000000'
                  // backgroundColor: '#eee',
                  // borderColor: '#aaa',
                  // borderWidth: 1,
                  // borderRadius: 4,
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: params.data
          }
        ]
      },
      media: [
        {
          option: {
            title: {
              show: true,
              text: params.text + ' 共' + this.numberpipe.transform(total, '1.0-3') + '吨',
              // subtext: this.numberpipe.transform(total, '1.0-3') + '吨',
              // textAlign: 'center',
              // textVerticalAlign: 'middle',
              // left: '50%',
              // top: '50%',
              subtextStyle: {
                fontSize: 16
              },
              textStyle: {
                fontSize: 18
              }
            },
            // legend: {
            //   right: 'center',
            //   bottom: 0,
            //   orient: 'horizontal',
            //   data: names
            // },
            series: [
              {
                radius: ['40%', '60%'],
                label: {
                  normal: {
                    show: true,
                    formatter: '{b}: {c} ({d}%)',
                    textStyle: {
                      fontSize: 16
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: true
                  }
                },
                emphasis: {
                  label: {
                    formatter: '{b}: {c} ({d}%)',
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                },
              }
            ]
          }
        },
        // {
        //   query: {
        //     maxWidth: 500
        //   },
        //   option: {
        //     title: {
        //       show: true,
        //       text: params.text + ' 共' + this.numberpipe.transform(total, '1.0-3') + '吨',
        //       subtextStyle: {
        //         fontSize: 12
        //       },
        //       textStyle: {
        //         fontSize: 14
        //       }
        //     },
        //     series: [
        //       {
        //         radius: ['40%', '60%'],
        //         emphasis: {
        //           label: {
        //             formatter: '{d}%',
        //             show: true,
        //             fontSize: 14
        //           }
        //         },
        //         label: {
        //           normal: {
        //             show: true,
        //             formatter: '{d}%',
        //             textStyle: {
        //               fontSize: 12,
        //             }
        //           }
        //         },
        //         labelLine: {
        //           normal: {
        //             show: true
        //           }
        //         },
        //       }
        //     ]
        //   }
        // }
      ]
    };
    piechart.setOption(optionPie);
    piechart.resize();
  }
  /**初始化地图图表参数 */
  mapchartInit(params, mapchart) {
    this.http.get('assets/server/chart/china.json').toPromise().then(data => {
      echarts.registerMap('China', data.json());
      const optionMap = {
        tooltip: {
          trigger: 'item',
          // formatter: '{b}：{c}',
          formatter: (params1) => {
            if (params1.value) {
              const value = this.numberpipe.transform(params1.value, '1.0-3');
              return `${params1.name}:${value}`;
            }
          },
        },
        toolbox: {
          show: true,
          feature: {
            myTool1: {
              show: true,
              title: '查询',
              // tslint:disable-next-line:max-line-length
              icon: 'path://M883.626667 823.04l-145.066667-144.64A337.92 337.92 0 0 0 810.666667 469.333333a341.333333 341.333333 0 1 0-341.333334 341.333334 337.92 337.92 0 0 0 209.066667-72.106667l144.64 145.066667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667zM213.333333 469.333333a256 256 0 1 1 256 256 256 256 0 0 1-256-256z',
              onclick: () => {
                this.show(params.type);
              }
            },
            saveAsImage: {
              show: true,
              name: params.savename,
              pixelRatio: 1.3
            }
          },
        },
        title: {
          text: params.graphictext
        },
        // legend: {
        //   data: ['各品种区域出货量']
        // },
        visualMap: {
          type: 'continuous',
          min: params.min,
          max: params.max,
          text: ['高', '低'],
          calculable: true,
          precision: 3,
          inRange: {
            color: ['#90dcfd', '#0773be']
          }
        },
        series: [
          {
            name: '各品种区域出货量',
            type: 'map',
            mapType: 'China',
            itemStyle: {
              normal: {
                areaColor: '#cccccc',
                borderColor: 'white',
                label: { show: true, color: 'white' }
              },
              emphasis: {
                areaColor: '#A5DABB'
              }
            },
            zoom: 1.2,
            roam: 'scale',
            data: params.data.length ? params.data : this.datamapvalue,
            label: {
              normal: {
                show: true,
                // position: 'center',
                // formatter: '{b}: {c}',
                formatter: (params2) => {
                  const value = this.numberpipe.transform(params2.value, '1.2-2');
                  if (Number(params2.value) > 0) {
                    return `${params2.name}`;
                  } else {
                    return '';
                  }
                },
                textStyle: {
                  // fontSize: 20,
                  // backgroundColor: '#eee',
                  color: '#000'
                  // borderColor: '#aaa',
                  // borderWidth: 1,
                  // borderRadius: 4,
                }
              },
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
          }
        ],
      };
      mapchart.setOption(optionMap);
      mapchart.resize();
    });
  }
  /**更新 */
  // randomize(): void {
  //   // Only Change 3 values
  //   const data = [
  //     59,
  //     Math.round(Math.random() * 100),
  //     80,
  //     (Math.random() * 100),
  //     56,
  //     (Math.random() * 100),
  //     40];
  //   const data1 = [
  //     59,
  //     Math.round(Math.random() * 100),
  //     80,
  //     (Math.random() * 100),
  //     56,
  //     (Math.random() * 100),
  //     40];
  //   this.barEchartsInstance.setOption({
  //     series: [
  //       {
  //         name: '直接访问',
  //         data: data
  //       },
  //       {
  //         name: '邮件营销',
  //         data: data1
  //       }
  //     ]
  //   });
  // }
  /**显示查询弹窗 */
  show(type) {
    if (type === 1) {
      this.showorg = true;
    } else {
      this.showorg = false;
    }
    this.charttype = type;
    this.classicModal.show();
  }
  /**关闭查询弹窗 */
  coles() {
    this.classicModal.hide();
  }
  /**查询 */
  query() {
    if (this.showorg) {
      if (!this.params.orgid) {
        this.toast.pop('warning', '请选择机构！');
        return;
      }
    }
    this.params.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.params.end = this.datepipe.transform(this.end, 'y-MM-dd');
    switch (this.charttype) {
      case 0:
        this.getPie();
        break;
      case 1:
        this.getPieChandi();
        break;
      case 2:
        this.getPieTudu();
        break;
      case 3:
        this.getBarOrgTihuo();
        break;
      case 4:
        this.getBarGnTihuo();
        break;
      case 5:
        this.getMapAreaTihuo();
        break;
      default:
        break;
    }
    this.coles();
  }
  /**点击tab标签 */
  handleChange(e) {
    const index = e.index;
    switch (index) {
      case 0:
        setTimeout(() => {
          if (this.pieEchartsInstance) {
            this.pieEchartsInstance.resize();
          }
        }, 0);
        break;
      case 1:
        setTimeout(() => {
          if (this.pieEchartChandiInstance) {
            this.pieEchartChandiInstance.resize();
          }
        }, 0);
        break;
      case 2:
        setTimeout(() => {
          if (this.pieEchartTuduInstance) {
            this.pieEchartTuduInstance.resize();
          }
        }, 0);
        break;
      case 3:
        setTimeout(() => {
          if (this.barEchartsOrgInstance) {
            this.barEchartsOrgInstance.resize();
          }
        }, 0);
        break;
      case 4:
        setTimeout(() => {
          if (this.barEchartsGnInstance) {
            this.barEchartsGnInstance.resize();
          }
        }, 0);
        break;
      default:
        setTimeout(() => {
          if (this.mapEchartsInstance) {
            this.mapEchartsInstance.resize();
          }
        }, 0);
        break;
    }
  }
  liveUpdate() {
    const aa = setInterval(() => {
      this.count ++;
      let now: any = new Date();
      now = new Date(now - this.count * 24 * 60 * 60 * 1000);
      this.params.start = now.toLocaleDateString().replace(/^\D*/, '');
      this.params.start = this.datepipe.transform(this.params.start, 'y-MM-dd');
      this.getBarOrgTihuo();
      if (this.count > 50) {
        clearInterval(aa);
      }
    }, 5000);
  }
}
