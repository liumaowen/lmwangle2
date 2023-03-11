import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ClassifyApiService {

    constructor(private http: Http) { }
    getChildrenTree(pid): Promise<any> {
        return this.http.get('store/api/classify/getChildrenTree', { search: pid }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    getsalebill(pid): Promise<any> {
        return this.http.get('store/api/classify/salebill', { search: pid }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // 获取gc列表
    listGc(search): Promise<any> {
        return this.http.get('store/api/kucun/findgc', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // 添加gc
    addGc(search) {
        return this.http.get('store/api/kucun/addgc', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // 获取仓库
    changkulist() {
        return this.http.get('store/api/classify/cangkulist').toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // 获取同区县仓库
    getsamekulist(search) {
        return this.http.post('store/api/classify/samecangkulist', search).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // 获取品名分类
    listBypid(search: object): Promise<any> {
        return this.http.get('store/api/classify/listBypid', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // 物料编码根据产地获取详细信息
    listproperties(search: object): Promise<any> {
        return this.http.get('store/api/classify/listproperties', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // 根据产地、油漆种类获取颜色信息
    listcolors(search: object): Promise<any> {
        return this.http.get('store/api/classify/listcolors', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // 添加属性
    addNameToCls(search): Promise<any> {
        return this.http.post('store/api/classify/addNameToCls', search).toPromise();
    }
    // 添加色系
    createColorSystem(search): Promise<any> {
        return this.http.post('store/api/classify/colorSystem', search).toPromise();
    }

    // 添加烨辉色系（根据油漆种类添加色系）
    createYehuiColorSystem(search): Promise<any> {
        return this.http.post('store/api/classify/colorYehuiSystem', search).toPromise();
    }
    // 获取产品信息
    getGnAndChandi(): Promise<any> {
        return this.http.get('store/api/classify/gnchandi').toPromise().then(data => {
            return data.json() as any[];
        });
    }
    getAttrs(id): Promise<any> {
        return this.http.get('store/api/classify/getattrs/' + id).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    //分类获取品名
    getarea(): Promise<any> {
        return this.http.get('assets/server/dnn/area.json').toPromise().then(data => {
            return data.json() as any[];
        });
    }
    //获取所有的区域
    getareas(): Promise<any> {
        return this.http.get('store/api/classify/getallarea').toPromise().then(data => {
            return data.json() as any[];
        });
    }
    getcangkus(areaid): Promise<any> {
        return this.http.get('store/api/classify/getcangkubyareaid/' + areaid).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    cangkulist() {
        return this.http.get('store/api/classify/cangkulist').toPromise().then(data => {
            return data.json() as any[];
        });
    }
    getBrothernode(search) {
        return this.http.get('store/api/classify/listbrother', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        })
    }

    listProperties(search) {
        return this.http.get('store/api/classify/listproperties', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        })
    }

    queryWidth(search) {
        return this.http.get('store/api/classify/queryWidth', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        })
    }
    //获取当前节点的父节点
    getParentNode(id) {
        return this.http.get('store/api/classify/getparentnode/' + id).toPromise().then(data => {
            return data.json() as any[];
        })
    }

    addNode(search) {
        return this.http.post('store/api/classify', search).toPromise();
    }

    get(id) {
        return this.http.get('store/api/classify/' + id).toPromise().then(data => {
            return data.json() as any;
        });
    }

    update(id, search) {
        return this.http.put('store/api/classify/' + id, search).toPromise();
    }
    query(search) {
        return this.http.get('store/api/classify', { search: search }).toPromise();
    }

    addcangku(search) {
        return this.http.post('store/api/classify/addcangku', search).toPromise();
    }

    getcangku(id) {
        return this.http.get('store/api/classify/getcangku/' + id).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    chukufeeList(id) {
        return this.http.get(`store/api/chukufee/${id}`).toPromise().then(data => {
            return data.json() as any[];
        });
    }
 

      ///////////////////////* 批量删除费用明细 */
      deleteChukufees(search) {
        return this.http.post('store/api/chukufee/chukufees', search ).toPromise();
      }

  


    addChukufee(search) {
        return this.http.post('store/api/chukufee', search).toPromise();
    }

    deleteChukufee(id) {
        return this.http.delete('store/api/chukufee/' + id).toPromise();
        // return this.http.post('store/api/projectcrm/fenye/', {}).toPromise();
    }
    delzhuanhuofees(search) {
        return this.http.post('store/api/zhuanhuofee/delzhuanhuofees', search ).toPromise();
      }

    zhuanhuofeeList(id) {
        return this.http.get(`store/api/zhuanhuofee/${id}`).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    customerList(id) {
        return this.http.get(`store/api/cangku/${id}`).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    addZhuanhuofee(search) {
        return this.http.post('store/api/zhuanhuofee', search).toPromise();
    }

    deleteZhuanhuofee(id) {
        return this.http.delete(`store/api/zhuanhuofee/${id}`).toPromise();
    }

    deleteCangkuCustomer(id) {
        return this.http.delete(`store/api/cangku/${id}`).toPromise();
    }

    createGuanlian(customerid, cangkuid) {
        return this.http.post('store/api/cangku', { customerid: customerid, cangkuid: cangkuid }).toPromise();
    }

    updatecangku(search) {
        return this.http.put('store/api/classify/updatecangku', search).toPromise();
    }
    updatecangkuaddr(id, search) {
        return this.http.put('store/api/classify/updatecangkuaddr/' + id, search).toPromise();
    }

    disable(id) {
        return this.http.get(`store/api/classify/disable/${id}`).toPromise();
    }

    enable(id) {
        return this.http.get(`store/api/classify/enable/${id}`).toPromise();
    }

    remove(id) {
        return this.http.delete(`store/api/cangkutime/${id}`).toPromise();
    }

    queryTime(search) {
        return this.http.get('store/api/cangkutime', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    save(search, id?) {
        if (id) {
            return this.http.post('store/api/cangkutime?batch=', search).toPromise();
        } else {
            return this.http.post('store/api/cangkutime', search).toPromise();
        }
    }

    removes(search) {
        return this.http.delete('store/api/cangkutime', { search: search }).toPromise();
    }

    getState(search) {
        return this.http.get('store/api/cangkutime/state', { search: search }).toPromise();
    }
    updatekucunclassify(search) {
        return this.http.put('store/api/classify/updatekucunclassify', search).toPromise();
    }
    /**
    * 获取跟进阶段列表
    */
    liststage(kid: string) {
        return this.http.get(`store/api/classify/list/${kid}`).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // 获取净料核算费用
    jingliaohesuan(search: object): Promise<any> {
        return this.http.get('store/api/classify/jingliaohesuan', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    /**
     * 根据kid查询字典
     * @param kid 字典中配置的kid
     */
    listclassify(kid: string) {
        return this.http.get(`store/api/classify/list/${kid}`).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    // 获取建议地址，地址自动提示
    getSuggestionPlace(keyword): Promise<any[]> {
        return this.http.get('store/api/suggestion/getplace', { search: { keyword: keyword } }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
}
