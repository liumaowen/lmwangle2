import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { MenuItemDef } from 'ag-grid/main';
import { DecimalPipe } from '@angular/common';
declare var $: any;

@Injectable()
export class SettingsService {

    //  aggird预加载显示
    public overlayLoadingTemplate: string = "<div><span class='text-align'  style='color:#3BBFE8;border-radius: 5px;border: 1px solid #3BBFE8;padding: 5px 8px'>请查询数据</span></div>";

    //  aggird没有查询到数据显示
    public overlayNoRowsTemplate: string = "<div><span class='text-align'  style='color:#3BBFE8;border-radius: 5px;border: 1px solid #3BBFE8;padding: 5px 8px'>没有查询到数据</span></div>";

    //  aggird导出Excel表格采用的样式
    public excelStyles = [{ id: "redFont", interior: { color: "#FF0000", pattern: 'Solid' } },
    {
        id: "greenBackground", alignment: { horizontal: 'Right', vertical: 'Bottom' },
        borders: {
            borderBottom: { color: "#000000", lineStyle: 'Continuous', weight: 1 },
            borderLeft: { color: "#000000", lineStyle: 'Continuous', weight: 1 },
            borderRight: { color: "#000000", lineStyle: 'Continuous', weight: 1 },
            borderTop: { color: "#000000", lineStyle: 'Continuous', weight: 1 }
        },
        font: { color: "#e0ffc1" }, interior: { color: "#008000", pattern: 'Solid' }
    }];
    //   aggird 国际化设置语言
    //   tslint:disable-next-line:max-line-length
    public LOCALETEXT: any = JSON.parse('{"page":"页","more":"更多","to":"到","of":"当前","next":"下一页","last":"最后","first":"第一","previous":"上一页","loadingOoo":"正在加载中...","selectAll":"全部选择","searchOoo":"搜索","blanks":"清空","filterOoo":"筛选...","applyFilter":"应用筛选...","equals":"等于","lessThan":"小于","greaterThan":"大于","contains":"包含","startsWith":"开始匹配","endsWith":"末尾匹配","group":"组","columns":"工具","rowGroupColumns":"行分组列","rowGroupColumnsEmptyMessage":"行分组列为空","valueColumns":"纵列值","pivotMode":"清空列","groups":"组","values":"函数","pivots":"排序","valueColumnsEmptyMessage":"函数列表为空","pivotColumnsEmptyMessage":"排序列表为空","toolPanelButton":"菜单","noRowsToShow":"没有数据","pinColumn":"列","valueAggregation":"函数","autosizeThiscolumn":"自适应该列","autosizeAllColumns":"自适应全部列","groupBy":"分组","ungroupBy":"不分组","resetColumns":"重置表格","expandAll":"展开所有组","collapseAll":"关闭所有组","toolPanel":"工具板","export":"导出","csvExport":"导出CSV格式","excelExport":"导出Excel格式","pinLeft":"固定最左","pinRight":"固定最右","noPin":"还原","sum":"总计","min":"求最小值","max":"求最大值","none":"置空","count":"总数","average":"平均","copy":"复制全部","copyWithHeaders":"复制标题","ctrlC":"复制 Ctrl + c","paste":"粘贴","ctrlV":"拷贝 Ctrl + v"}');

    public user: any;
    public app: any;
    public layout: any;
    public bodyHeight: number;
    public mainpanelHeight: number;

    public docUrl;

    constructor(private numberpipe: DecimalPipe) {

        //  获取浏览器的高
        this.bodyHeight = (document.body.clientHeight);
        window.onresize = () => {
            this.bodyHeight = (document.body.clientHeight);
        }
        this.mainpanelHeight = (document.documentElement.offsetHeight);

        //  用户头像地址
        this.docUrl = "http://  gm-wiskind.wiskind.cn/";

        //   User Settings
        //   -----------------------------------
        this.user = {
            name: 'John',
            job: 'ng-developer',
            picture: 'assets/img/user/02.jpg'
        };

        //   App Settings
        //   -----------------------------------
        this.app = {
            name: 'wiskind',
            version: environment.version,
            servername: environment.servername,
            server: environment.server,
            description: '',
            year: ((new Date()).getFullYear())
        };

        //   Layout Settings
        //   -----------------------------------
        this.layout = {
            isFixed: true,
            isCollapsed: false,
            isBoxed: false,
            isRTL: false,
            horizontal: false,
            isFloat: false,
            asideHover: false,
            theme: null,
            asideScrollbar: false,
            isCollapsedText: false,
            useFullLayout: false,
            hiddenFooter: false,
            offsidebarOpen: false,
            asideToggled: false,
            viewAnimation: 'ng-fadeInUp'
        };

    }
    //  aggird自动响应
    onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    }

    //  aggird保留三位小数
    valueFormatter = (params) => {
        try {
            return this.numberpipe.transform(params.value, '1.0-3')
        } catch (error) {
            return null;
        }
    }


    //  aggird保留两位小数
    valueFormatter2 = (params) => {
        try {
            return this.numberpipe.transform(typeof params.value == "object" ? params.value.value : params.value, '1.2-2')
        } catch (error) {
            return null
        }
    }

    //  aggird保留3位小数
    valueFormatter3 = (params) => {
        try {
            return this.numberpipe.transform(typeof params.value == "object" ? params.value.value : params.value, '1.3-3')
        } catch (error) {
            return null
        }
    }
    valueFormatter4 = (params) => {
        try {
            return this.numberpipe.transform(typeof params.value == "object" ? params.value.value : params.value, '1.0-0')
        } catch (error) {
            return null
        }
    }

    //  aggird右键菜单选择
    getContextMenuItems = (params) => {
        let result = [
            { //   custom item
                name: '全选',
                action: () => {
                    //  params.api.deselectAll();
                    //  params.api.selectAll();
                    params.api.selectAllFiltered()
                }
            },
            { //   custom item
                name: '全不选',
                action: () => {
                    params.api.deselectAll();
                }
            },
            {
                name: '导出',
                subMenu: [
                    { name: '导出未分组Excel表格', action: () => { params.api.exportDataAsExcel({ skipHeader: false, skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true, skipGroups: true, suppressQuotes: false, fileName: '报表.xls' }) } },
                    { name: '导出分组Excel表格', action: () => { params.api.exportDataAsExcel({ skipHeader: false, skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true, skipGroups: false, suppressQuotes: false, fileName: '报表.xls' }) } },
                    { name: '导出未分组Csv表格', action: () => { params.api.exportDataAsCsv({ skipHeader: false, skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true, skipGroups: true, suppressQuotes: false, fileName: '报表.cvs' }) } },
                    { name: '导出分组Csv表格', action: () => { params.api.exportDataAsCsv({ skipHeader: false, skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true, skipGroups: false, suppressQuotes: false, fileName: '报表.cvs' }) } },
                ]
            },
            'copy',
            {
                name: '自适应',
                action: () => {
                    //   params.api.exportDataAsCsv(params);
                    params.columnApi.autoSizeAllColumns();
                }
            },
            {
                name: '收缩组',
                subMenu: [{ name: '全部展开', action: () => { params.api.expandAll() } }, { name: '全部收缩', action: () => { params.api.collapseAll() } }]
            }
        ];
        return result;
    }

    getAppSetting(name) {
        return name ? this.app[name] : this.app;
    }
    getUserSetting(name) {
        return name ? this.user[name] : this.user;
    }
    getLayoutSetting(name) {
        return name ? this.layout[name] : this.layout;
    }

    setAppSetting(name, value) {
        if (typeof this.app[name] !== 'undefined') {
            this.app[name] = value;
        }
    }
    setUserSetting(name, value) {
        if (typeof this.user[name] !== 'undefined') {
            this.user[name] = value;
        }
    }
    setLayoutSetting(name, value) {
        if (typeof this.layout[name] !== 'undefined') {
            return this.layout[name] = value;
        }
    }

    toggleLayoutSetting(name) {
        return this.setLayoutSetting(name, !this.getLayoutSetting(name));
    }

    /**
     * 获取上个月日期
     * @param date 当前时间
     * @returns  obj: {lastyear,lastmonth,lastdate}
     */
    getlastdate(date: Date) {
        if (date === null || date === undefined) {
            date = new Date();
        }
        let year = date.getFullYear();
        let month: any = date.getMonth();
        if (month === 0) {
            month = 12;
            year = year - 1;
        }
        if (month < 10) {
            month = '0' + month;
        }
        const myDate = new Date(year, month, 0);
        return { lastyear: year, lastmonth: month, lastdate: myDate.getDate() };
    }

}
