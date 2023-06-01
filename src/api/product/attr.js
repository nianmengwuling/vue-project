//平台属性管理模块请求文件
import request from "@/utils/request";

//获取一级分类数据接口
// /admin/product/getCategory1   get
export const reqCategory1List = () =>
  request({ url: "/admin/product/getCategory1", method: "get" });

//获取二级分类数据接口
export const reqCategory2List = (category1Id) =>
  request({ url: `/admin/product/getCategory2/${category1Id}`, method: "get" });

//获取三级分类数据接口
export const reqCategory3List = (category2Id) =>
  request({ url: `/admin/product/getCategory3/${category2Id}`, method: "get" });

/* 得到三个分类的ID，获取综合了三种分类的接口 */
export const reqAttrList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });

/* 添加商品属性 */
export const reqAddOrUpdateAttr = (data) =>
  request({ url: "/admin/product/saveAttrInfo", data, method: "post" });
/* 对于添加一个属性不需要带id,id由服务器的数据库生成，可以从接口具体数据看到
{
  "attrName": "string",  属性名
  "attrValueList": [     属性名中属性值,因为属性值可以是多个,因此需要的是数组
    {
      "attrId": 0,        属性值得id
      "valueName": "string" 属性值
    }
  ],
  "categoryId": 0,     category3Id
  "categoryLevel": 3,
}
*/
