import request from "@/utils/request";

export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: "get",
    params: { category3Id },
  });
//获取SPU信息
// /admin/product/getSpuById/{spuId}   get请求  参数spuId
export const reqSpu = (spuId) =>
  request({ url: `/admin/product/getSpuById/${spuId}`, method: "get" });

//获取品牌的信息
// /admin/product/baseTrademark/getTrademarkList  get请求
export const reqTradeMarkList = () =>
  request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: "get",
  });

//获取SPU图片的接口
// /admin/product/spuImageList/{spuId}  get请求
export const reqSpuImageList = (spuId) =>
  request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" });

//获取平台全部销售属性---整个平台销售属性一共三个
// /admin/product/baseSaleAttrList  get请求
export const reqBaseSaleAttrList = () =>
  request({ url: `/admin/product/baseSaleAttrList`, method: "get" });

/* 修改或添加SPU */
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    /* 携带的参数有id，说明是修改，走修改接口 */
    return request({
      url: "/admin/product/updateSpuInfo",
      method: "post",
      data: spuInfo,
    });
  } else {
    /* 携带的参数无id，说明是添加，走添加接口 */
    return request({
      url: "/admin/product/saveSpuInfo",
      method: "post",
      data: spuInfo,
    });
  }
};

/* 删除Spu  */
export const reqDeleteSpu = (spuId) =>
  request({ url: `/admin/product/deleteSpu/${spuId}`, method: "delete" });

/* 获取销售属性数据 */
export const reqSpuSaleAttrList = (spuId) =>
  request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: "GET" });

/* 商品基础属性 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} */
export const reqAttrInfoList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "GET",
  });

/* 添加sku */
export const reqAddSku = (skuInfo) =>
  request({ url: "/admin/product/saveSkuInfo", method: "POST", data: skuInfo });

/* 查看sku列表数据  */
export const reqSkuList = (spuId) =>
  request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: "GET",
  });
