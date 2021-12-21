import Icon from '@ant-design/icons';
import { message, Table, Tag } from 'antd';
import axios, { AxiosResponse } from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PATH } from '../../types/actionTypes';
import { FontObject, LoadingDataType, StoreType } from '../../types/propsTypes';
import { SettingIcon } from '../Icon';


interface TrainMarkViewProps {
  LoadingDataCom:LoadingDataType,
	MarkTexts: Array<any>
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
      data: [...this.props.MarkTexts],
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
				// key: 'text',
				align: 'left',
				render: (text: Array<FontObject>, record: unknown, index: number) => {
					// const { data, current, updateMarkTextData, updateTextsData } = this.props
					// console.log(text)
          const { data ,current} = this.state
					// console.log(data)
					return (
						<div 
							style={{
								fontSize:"1rem"
							}}
						>
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
									} 
									else {
										return (
											// color={value['color']}
											<Tag key={i} color={value['color']}
												icon={<Icon component={SettingIcon}/>}
												closable={false}
												style={{
													marginLeft: '5px'
												}} >
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
		// console.log(this.props.MarkTexts)
		// console.log(this.state.data)
    return (
      <div
        style={{
          height:"100%",
          width:"100%"
        }}
      >
        <Table 
          columns={this.columns} 
          dataSource={this.props.MarkTexts.length !== 0 ? [...this.props.MarkTexts] : []} 
          size='small' 
          sticky = {false}
					scroll={{y:`calc(48vh)`}}
					pagination={{
						pageSize:5,
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
					// rowSelection={{
						// selectedRowKeys,
						// onChange: (selectedRowKeys, selectedRows) => {
							// console.log("rowChange",selectedRowKeys,selectedRows)
							// this.setState({ selectedRowKeys, selectedRows })
							// console.log(selectedRowKeys, selectedRows)
						// }
						
					// }}
				/>
      </div>
    )
  }

  public componentDidMount() {
    // console.log(this.props.LoadingDataCom)
    // axios.get(`${PATH}/mongo/markTexts/all`).then((res:AxiosResponse<any,any>) => {
    //   if(res.data.status === 200){
        // const { data } = res.data.data
        axios.get(`${PATH}/mongo/label/all`).then((res:AxiosResponse<any,any>) => {
          if(res.data.status === 200){
            const {data:labels} = res.data
            this.setState({
              // data,
              labels
            })
          }
        })
    //   }
    // })




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