import axios, { AxiosResponse } from 'axios';
import React, { Component } from 'react';
import { PATH } from '../../../types/actionTypes';
import * as d3 from "d3"

var c_colors = ["#99CCCC", "#FFCCCC", "#0099CC", "#FF9966", "#99CC66"
    , "#CCCCFF", "#666666", "#996699", "#CCCC99", "#CC9999"]

interface ClusteringPlotDataType {
    [kindIndex: string]: {
        center: Array<string>,
        nodes: Array<{
            class_id: number,
            index: string,
            position: string[],
            sentence: string
        }>
    }
}

interface MyScatterChartProps {

}
interface MyScatterChartState {
    scatter_data: ClusteringPlotDataType,
}
class MyScatterChart extends Component<MyScatterChartProps, MyScatterChartState>{
    public constructor(props: MyScatterChartProps) {
        super(props)
        this.state = {
            scatter_data:{}
        }
    }

    draw_circle = () => {
        const { scatter_data } = this.state
        // const { updateMarkTextData , changeMenuSelect,changeClusteringPlotClass} = this.props
        const class_id = Object.keys(scatter_data);
        const all_nodes: any[] = []
        const svg_width = (document.querySelector(".scatter_svg") as Element).clientWidth;
        const svg_height = (document.querySelector(".scatter_svg") as Element).clientHeight;
        var x_min = 100000;
        var x_max = -10000;
        var y_min = 100000;
        var y_max = -10000;

        var xx = function (id: string) {
            scatter_data[id].nodes.forEach((item: { position: string[]; }) => {
                x_min = x_min > parseFloat(item.position[0]) + svg_width / 2 ? parseFloat(item.position[0]) + svg_width / 2 : x_min;
                x_max = x_max < parseFloat(item.position[0]) + svg_width / 2 ? parseFloat(item.position[0]) + svg_width / 2 : x_max;
                y_min = y_min > parseFloat(item.position[1]) + svg_height / 2 ? parseFloat(item.position[1]) + svg_height / 2 : y_min;
                y_max = y_max < parseFloat(item.position[1]) + svg_height / 2 ? parseFloat(item.position[1]) + svg_height / 2 : y_max;
                all_nodes.push(item);
            })
        }

        for (let id of class_id) {
            xx(id);  //循环调用函数  而不是将函数体写在里面避免可能存在的错误
        }
        //比例尺的地方
        const [data_width, data_height] = [x_max - x_min, y_max - y_min];
        const [domin_w, domin_h] = [svg_width / 1 / data_width * 0.9, svg_height / 1 / data_height * 0.9]
        d3.selectAll(".scatter_nodes").remove();
        const svg = d3.selectAll(".scatter_svg");

        svg.append("g")
            .selectAll(".scatter_nodes")
            .data(all_nodes)
            .enter()
            .append("circle")
            .attr("class", "scatter_nodes")
            .attr("transform", function (d: { class_id: string | number; position: string[]; }) {
                const [c_x, c_y] = scatter_data[d.class_id].center;
                // const c_x1 = parseFloat(c_x) * domin_w * 0.01 + svg_width/2;
                // const c_y1 = parseFloat(c_y) * domin_h * 0.01 + svg_height/2;
                const x = parseFloat(d.position[0]), y = parseFloat(d.position[1]);    //移动点的位置
                const p_x = ((parseFloat(c_x) - x) * 1.2 + parseFloat(c_x)) * domin_w * 0.9 + svg_width / 2, p_y = ((parseFloat(c_y) - y) * 1.2 + parseFloat(c_y)) * domin_h * 0.9 + svg_height / 2;
                return `translate(${p_x},${p_y})`
            })
            .attr("r", 3)
            .attr("fill", (item: { class_id: any; }) => {
                const { class_id } = item
                return c_colors[class_id];
            })
            // .attr("opacity",(d)=>{
            //     let {class_id} = d;
            //     let {now_class_id} = this.props;
            //     return class_id === now_class_id ? 1 : 0.5;
            // })       //用于预测的节点高亮
            .on("click", (e: any, d: { [x: string]: string | number; }) => {
                console.log("clusteringPlot", e, d['class_id'])

                // changeClusteringPlotClass(d['class_id'])


            })
    }

    componentDidMount() {

        axios.get(`${PATH}/mongo/scatterData/all`).then((res:AxiosResponse<any,any>) => {
            if(res.data.status === 200 ){
                console.log("scatterData",res.data.data)
                this.setState({
                    scatter_data:res.data.data.data
                })
            }
        })
        this.draw_circle()
    }

    componentDidUpdate() {
        this.draw_circle()
    }

    public render(): JSX.Element {
        const { scatter_data } = this.state
        const class_id = Object.keys(scatter_data)
        return (
            <div className="Scatter"
                style={{
                    height: "100%",
                    width: "100%"
                }}
            >

                {/* <Slider defaultValue={30}  
                    style={{
                        width:"40%",
                        // height:"10%"
                    }}
                    onAfterChange={(value)=>{
                        this.setState({percent:value})
                    }}
            /> */}


                <svg className="scatter_svg"
                    style={{
                        height: "90%",
                        width: "100%"
                    }}
                >


                    {/* {
                        class_id.map((item,index)=>{
                            return <circle className="nodes_labels" key={item} fill = {c_colors[index]} r="5px" cx={"10px"} cy={10+ 12 *index +"px"} opacity="0.7" 
                                style={{
                                    // float:"left"
                                }}
                            ></circle>
                        })
                    }
                    {
                        class_id.map((item,index)=>{
                            return <text className="nodes_labels_text" key={"nodes_labels_text"+index} fill = {c_colors[index]} x={"20px"} y={14+ 12 *index +"px"} opacity="1" fontSize="10px">{index}</text>
                        })
                    } */}


                </svg>
            </div>
        )
    }
}
export default MyScatterChart;