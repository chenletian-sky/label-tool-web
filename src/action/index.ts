import { CHANGE_LOADINGDATA_DICTIONARY_SELECTOBJECT, CHANGE_LOADINGDATA_TEXTS_SELECTOBJECT } from "../types/actionTypes";

/**
 * 更新 数据加载页面中的 字典数据的 选中对象
 */
export const changeLoadingDataDictionarySelectObject =  (dictionarySelectObject: any) => ({
  type:CHANGE_LOADINGDATA_DICTIONARY_SELECTOBJECT,
  dictionarySelectObject
})

export const changeLoadingDataTextsSelectObject = (textsSelectObject: any) => ({
  type:CHANGE_LOADINGDATA_TEXTS_SELECTOBJECT,
  textsSelectObject
})