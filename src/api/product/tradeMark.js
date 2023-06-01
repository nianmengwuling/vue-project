//获取品牌管理数据模块
//引入封装的axios
import request from "@/utils/request";
//获取品牌列表接口
export const reqTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });

/* 新增和修改品牌，接口二合一  */
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  /* 假如带id，说明之前有录入，转到修改的接口 */
  if (tradeMark.id) {
    return request({
      url: "/admin/product/baseTrademark/update",
      method: "put",
      data: tradeMark,
    });
  } else {
    /* 假如没带id，说明是要添加，转到添加的接口 */
    return request({
      url: "/admin/product/baseTrademark/save",
      method: "post",
      data: tradeMark,
    });
  }
};

/* 删除品牌 */
export const reqDeleteTradeMark = (id) =>
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: "delete",
  });
