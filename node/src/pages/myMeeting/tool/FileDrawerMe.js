import React, { Component } from 'react';
import golbal from '@/golbal';
import {Button, Drawer, Icon, Modal, Table, Tooltip, Input, message} from "antd"
class FileDrawerMe extends Component {
    componentDidMount(){
    }
    state={
    }

    render() {
        const {
            visible, onClose
        } = this.props;
        const columns=[
            {   title:"ID",
                key:"id",
                render:(item,data,i)=>{
                    return(<div>{i+1}</div>)
                }
            },{
                title:"File Name",
                dataIndex:"fileName",
            },{
                title:"State",
                dataIndex:"status",
                render:(item)=>{
                    switch (item) {
                        case 1:
                            return "Allow Download"
                        case 2:
                            return "Prohibit Download"
                        default:
                            return item
                    }
                }
            },{
                title:"Operation",
                render:(item)=>{
                    return(
                        <div>
                            {
                                item.status===1?<Tooltip title="Download">
                                    {/*<Button onClick={()=>{this.download(item.id)}}><Icon type="download" /></Button>*/}

                                    <Button
                                        onClick={()=>{
                                            window.location.href = item.fileUrl+"/"+item.fileName
                                        }}
                                    >
                                        <Icon type="download" />
                                    </Button>


                                </Tooltip>:""
                            }
                        </div>
                    )
                }
            }
        ];
        return (
            <Drawer
                title={"会议文件"}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={"60%"}
            >
                <Table
                    rowKey={record=>record.id}
                    columns={columns}
                    dataSource={this.props.fileList}
                />
            </Drawer>
        );
    }
}

export default FileDrawerMe;
