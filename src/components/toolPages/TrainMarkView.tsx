import Icon from '@ant-design/icons';
import { message, Table, Tag } from 'antd';
import axios, { AxiosResponse } from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PATH } from '../../types/actionTypes';
import { FontObject, LoadingDataType, StoreType } from '../../types/propsTypes';
import { SettingIcon } from '../Icon';


interface TrainMarkViewProps {
  LoadingDataCom:LoadingDataType
}
interface TrainMarkViewState {
  labels:Array<any>,
  data:Array<any>,
  // columns:Array<any>
  current:number
}
class TrainMarkView extends Component<TrainMarkViewProps, TrainMarkViewState>{
  private startIndex: number
	private endIndex: number
	private columns: any
	private input: any
  public constructor(props: TrainMarkViewProps) {
    super(props)
    this.startIndex = -1
		this.endIndex = -1
    this.state = {
      labels:[],
      data:[],
      current:1
    }
    this.columns = [
			{
				title: <div style={{
					width: '100%',
					textAlign: 'center',
					// display:"none"
				}}>
					文本
				</div>,
				dataIndex: 'textArr',
				key: 'text',
				align: 'left',
				render: (text: Array<FontObject>, record: unknown, index: number) => {
					// const { data, current, updateMarkTextData, updateTextsData } = this.props
          const { data ,current} = this.state
					return (
						<div 
							style={{
								fontSize:"1rem"
							}}
						onMouseUp={
							() => {
								let start = Math.min(this.startIndex, this.endIndex)
								let end = Math.max(this.startIndex, this.endIndex)
								if (text.slice(start, end + 1).map((font: FontObject) => font['text']).join('').includes(getSelection()?.toString() as string) && getSelection()?.toString()) {
									
									const textBySelect: string = getSelection()?.toString() as string;
									
									start = start + text.slice(start, end + 1).map((font: FontObject) => font['text']).join('').indexOf(textBySelect);
									end = start + textBySelect.length - 1;
									
									let startIndex = data[current * 10 - 10 + index]['textArr'][start]['start']

									data[current * 10 - 10 + index]['textArr'].splice(start, end + 1 - start)
									data[current * 10 - 10 + index]['textArr'].splice(start, 0, {
										text: textBySelect,
										start: startIndex,
										end: startIndex + textBySelect.length - 1,
										label: 'uncertain',
										color: 'blue',
										// _id: Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36)
									})
                  
									// updateMarkTextData([...data])
									// updateTextsData([...data])

									// labelRecord[current * 10 - 10 + index].push({
									// 	start: startIndex,
									// 	end: endIndex,
									// 	label: 'none',
                  //   text: textBySelect,
                  //   color: 'blue'
									// })
                  // updateMarkRecord([...labelRecord])
								}
								getSelection()?.removeAllRanges()
								this.startIndex = this.endIndex = -1
							}
						}>
							{
								text.map((value: FontObject, i: number) => {
                  // console.log('r', labelRecord)
                  // const recordIndex = labelRecord[current * 10 - 10 + index].findIndex((r: { start: number; end: number; label: string; text: string; color: string }) => r['text'] === value )
									if (!value['text']) return '';
									if (value['text'].length <= 1 && value['label'] === 'none') {
										return (
											<div key={i} style={{
												display: 'inline-block',
											}} onMouseDown={
												() => {
													this.startIndex = i
												}
											} onMouseOver={
												() => {
													this.endIndex = i
												}
											} onMouseUp={
												() => {
													this.endIndex = i
												}
											}>
												{value['text']}
											</div>
										)
									} else {
										return (
											<Tag key={i} color={value['color']} closable
												icon={<Icon component={SettingIcon} onClick={
													() => {
														
													}
												} />}
												style={{
													marginLeft: '5px'
												}} onClose={
													() => {
														// const { data, current, updateMarkTextData } = this.props
														const arr: Array<FontObject> = value['text'].split('').map((str: string, index: number) => ({
															text: str,
															start: value['start'] + index,
															end: value['start'] + index,
															label: 'none',
															color: 'blue'
														}))
														data[current * 10 - 10 + index]['textArr'].splice(i, 1)
														// console.log(v, v.split(''));
														data[current * 10 - 10 + index]['textArr'].splice(i, 0, ...arr)
														// delete nameToColor[value]
                            // labelRecord[current * 10 - 10 + index] = labelRecord[current * 10 - 10 + index].filter((value: { start: number; end: number; label: string; text: string; color: string }) => (
                            //   value['text'] !== v
                            // ))
                            // console.log('.....', labelRecord)
                            // labelRecord[current * 10 - 10 + index].splice(j, 1)
                            // updateMarkRecord(labelRecord)

                            axios.post(`${PATH}/mongo/markTexts/update`,[...data]).then((res:AxiosResponse<any,any>) => {
                              if(res.data.status === 200){
                                message.success("更新标注数据成功！")
                              }
                            })
														// updateMarkTextData([...data])
														// updateTextsData([...data])
														
                            // this.setState({  })
													}
												}>
												{value['text']}
											</Tag>
										)
									}
								})
							}
						</div>
					)

				}
			}
		]
  }

  

  public render(): JSX.Element {
    const { labels,current} = this.state
    return (
      <div
        style={{
          height:"100%",
          width:"100%"
        }}
      >
        <Table 
          columns={this.columns} 
          dataSource={this.state.data ? this.state.data : []} 
          size='small' 
          sticky = {false}
					pagination={{
						pageSize:10,
            current,
						simple: true,
						position: ['bottomRight'],
						// showSizeChanger: true,
						onChange: (page: number) => {
							this.setState({
                current:page
              })
						}
					}}
					rowSelection={{
						// selectedRowKeys,
						// onChange: (selectedRowKeys, selectedRows) => {
							// console.log("rowChange",selectedRowKeys,selectedRows)
							// this.setState({ selectedRowKeys, selectedRows })
							// console.log(selectedRowKeys, selectedRows)
						// }
						
					}}
				/>
      </div>
    )
  }

  public componentDidMount() {
    console.log(this.props.LoadingDataCom)
    axios.get(`${PATH}/mongo/markTexts/all`).then((res:AxiosResponse<any,any>) => {
      if(res.data.status === 200){
        const { data } = res.data.data
        axios.get(`${PATH}/mongo/label/all`).then((res:AxiosResponse<any,any>) => {
          if(res.data.status === 200){
            const {data:labels} = res.data
            this.setState({
              data,
              labels
            })
          }
        })
      }
    })




		document.addEventListener('keydown', (e) => {
			
			if (e.ctrlKey) {
        e.preventDefault();
				// console.log("ctrlKey",e.ctrlKey,e.key)
				const { labels,data } = this.state
        // const { data, updateMarkTextData, updateTextsData } = this.props
				// console.log(labels,data)
				for (let i = 0; i < labels.length; i++) {
					if (labels[i]['key'] === e.key) {
						for (let j = data.length - 1; j >=0; j--) {
              data[j]['textArr'].forEach((value: FontObject) => {
                // if (value['color'] === 'blue') {
								if (value['label'] === 'uncertain') {
                  value['label'] = labels[i]['name']
                  value['color'] = labels[i]['color']
                }
              })
						}
            
            axios.post(`${PATH}/mongo/markTexts/update`,[...data]).then((res:AxiosResponse<any,any>) => {
              if(res.data.status === 200 ){
                message.success("标签更新成功")
              }
            })

						break;
					}
				}

        
			}
		})
	}
}
// export default TrainMarkView;

const mapStateToProps = (state:StoreType,ownProps?:any) =>{
  const { LoadingDataCom } = state
  return {
    ...ownProps,
    LoadingDataCom:LoadingDataCom
  }
}

export default connect(mapStateToProps,null)(TrainMarkView);