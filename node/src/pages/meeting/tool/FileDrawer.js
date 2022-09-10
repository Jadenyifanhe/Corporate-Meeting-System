import React, { Component } from 'react';
import golbal from '@/golbal';
import {Button, Drawer, Icon, Modal, Table, Tooltip, Input, message} from "antd"

//定义个a标签数组
const Anchor = props => {
    return (
        <a {...props}>{props.children}</a>
    );
};
class FileDrawer extends Component {
    componentDidMount(){
    }
    state={
    }
    //updateOne
    updateOne = (id,status) =>{
        const url=golbal.localhostUrl+"file/editOne?fileId="+id+"&status="+status;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if(data.status){
                message.success(data.message)
            }
            this.findAllOnManage();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //deleteOne
    deleteOne = (id) =>{
        const url=golbal.localhostUrl+"file/deleteOne?fileId="+id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if(data.status){
                message.success(data.message);
            }else{
                message.error(data.message);
            }
            this.findAllOnManage();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    download=(id)=>{
        const url=golbal.localhostUrl+"file/downLoad?fileId="+id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if(data.status){
                message.success("Successful operation!")
            }
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
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
                            <Tooltip title="Allow Download">
                                <Button onClick={()=>{this.updateOne(item.id,1)}}><Icon type="check" /></Button>
                            </Tooltip>
                            <Tooltip title="Prohibit Download">
                                <Button onClick={()=>{this.updateOne(item.id,2)}}><Icon style={{color:"red"}} type="close" /></Button>
                            </Tooltip>
                            <Tooltip title="Download">
                                {/*<Button onClick={()=>{this.download(item.id)}}><Icon type="download" /></Button>*/}
                                <Button
                                    onClick={()=>{
                                        window.location.href = item.fileUrl+"/"+item.fileName
                                    }}
                                >
                                    <Icon type="download" />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Button onClick={()=>{this.deleteOne(item.id)}}><Icon style={{color:"red"}} type="delete" /></Button>
                            </Tooltip>
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

                <Anchor id="downloadDiv" style={{display: 'none'}}></Anchor>

            </Drawer>
        );
    }
}

export default FileDrawer;
