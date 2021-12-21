import { Table, Tag } from 'antd';
import Icon from '@ant-design/icons';
import React, { Component } from 'react';
import { FontObject } from '../../types/propsTypes';
import { SettingIcon } from '../Icon';
import axios, { AxiosResponse } from 'axios';
import { PATH } from '../../types/actionTypes';


interface ShowMarkTextsProps {
  data:Array<any>,
}
interface ShowMarkTextsState {
  labels:Array<any>,
  
  // columns:Array<any>
  current:number
}
class ShowMarkTexts extends Component<ShowMarkTextsProps, ShowMarkTextsState>{
  private columns: any
  public constructor(props: ShowMarkTextsProps) {
    super(props)
    this.state = {
      labels:[],
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
				render: (text: Array<FontObject>, record: any, index: number) => {
					// const { data, current, updateMarkTextData, updateTextsData } = this.props
          const {  current} = this.state
          const { data } = this.props
					return (
						<div 
							// style={{
							// 	fontSize:"20px"
							// }}
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
											}} >
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
												}} 
                        >
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
    const {labels,current} = this.state
    return (
      <div
        style={{
          height:"100%",
          width:"100%"
        }}
      >
        <Table 
          columns={this.columns} 
          dataSource={this.props.data ? this.props.data : []} 
          size='small' 
					scroll={{ y:`calc(15vh)`  }}
					pagination={{
						// pageSize: this.props.PageSizeNeedChange && this.props.PageSizeNeedChange < 12 ? this.props.PageSizeNeedChange : 12 ,
						pageSize:10,
            current,
						simple: true,
						position: ['bottomRight'],
						// showSizeChanger: true,
						onChange: (page: number) => {
							this.setState({
                current:page
              })
              // updateTextTablePage(page)
							// this.setState({ pageSize: (pageSize as number) })
						}
					}}
					// rowSelection={{
					// 	// selectedRowKeys,
					// 	// onChange: (selectedRowKeys, selectedRows) => {
					// 		// console.log("rowChange",selectedRowKeys,selectedRows)
					// 		// this.setState({ selectedRowKeys, selectedRows })
					// 		// console.log(selectedRowKeys, selectedRows)
					// 	// }
						
					// }}
				/>
      </div>
    )
  }

  componentDidMount(){
    axios.get(`${PATH}/mongo/label/all`).then((res:AxiosResponse<any,any>) => {
      if(res.data.status === 200 ){
        this.setState({
          labels:res.data.data
        })
      }
    })
  }
}
export default ShowMarkTexts;