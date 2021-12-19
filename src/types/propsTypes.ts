/**
 * 全局 store 类型
 */
export interface StoreType{
  LoadingDataCom:LoadingDataType
}

export interface LoadingDataType{
  dictionarySelectObject?:{selectedRowKeys?:Array<any>,selectedRows?:Array<any>}
  textsSelectObject?:{selectedRowKeys?:Array<any>,selectedRows?:Array<any>}
}

export type DictionaryDataType =Array<DictionaryDetailDataType>

export interface DictionaryDetailDataType{
  key:string,    
  dictionaryName: string,
  dictionaryDescribe: string,
  wordsNum:String,
  dictsContent:String
  data:Array<{
    key:string,
    name:string,
    label:string,
    abbreviations:Array<string>
  }>
}

export type TextDataType = Array<TextDetailDataType>

export interface TextDetailDataType{
  textsName: string,
  textsDescribe: string,
  wordsNum:String,
  textsContent:String
  data:Array<{
    key:string,
    text:string,
    label:Array<any>,
    textArr:Array<{
      text:string,
      start:number,
      end:number,
      label:string,
      color:string
    }>
  }>
}


export type dataSourceType = Array<{
  key:number,
  name:string,
  description:string,
  words:string,
  dicts:string
  // functions:React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}>


/**
* 单个文字的类型
*/
export interface FontObject {
  text: string,
  start: number,
  end: number,
  label: string,
  color: string,
  _id?: string
}