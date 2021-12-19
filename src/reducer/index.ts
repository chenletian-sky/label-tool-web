import { combineReducers } from 'redux'
import { CHANGE_LOADINGDATA_DICTIONARY_SELECTOBJECT, CHANGE_LOADINGDATA_TEXTS_SELECTOBJECT } from '../types/actionTypes'
import { StoreType , LoadingDataType } from '../types/propsTypes'




const initStore:StoreType ={
  LoadingDataCom: {
    dictionarySelectObject:{},
    textsSelectObject:{}
  }
}

const LoadingDataComReducer = (state: LoadingDataType = initStore.LoadingDataCom, action: any) => {
  if(action.type === CHANGE_LOADINGDATA_DICTIONARY_SELECTOBJECT){
    const { dictionarySelectObject} = action
    return {
      ...state,
      dictionarySelectObject
    }
  }else if(action.type === CHANGE_LOADINGDATA_TEXTS_SELECTOBJECT){
    const { textsSelectObject } = action
    return {
      ...state,
      textsSelectObject
    }
  }
  return state
}

const combineReducer = combineReducers({
  // Main: MainReducer,
  LoadingDataCom:LoadingDataComReducer
})

const Reducer = (state:StoreType, action:any) => {
    
  return state
}

const reducer = (state:StoreType = initStore, action:any) => {
  const store1:StoreType = combineReducer(state, action)
  const store2:StoreType = Reducer(store1, action)
  return store2
}
export default reducer

