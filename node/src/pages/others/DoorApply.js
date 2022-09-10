import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Modal} from "antd";
import golbal from '@/golbal';
import Highlighter from 'react-highlight-words';
import OpenDoorCreateForm from "@/pages/others/tool/OpenDoorCreateForm";
class DoorApply extends Component {
    componentDidMount(){
        //this.selectAll();
        this.getEffectiveMeetroom();
        this.userShow();
    }
    state={
        dataSource:[
        ],
        roomList:[],
        drawerVisible:false,
        addOrChange:false,
        modalVisible: false,
        searchText:"",
    }
    //表格查询
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
                             setSelectedKeys, selectedKeys, confirm, clearFilters,
                         }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => { this.searchInput = node; }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }
    //表格查询

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    }
    onClose = (e) => {
        console.log(e);
        this.setState({
            drawerVisible: false,
        });
    }
    showDelete=(ev,id)=>{
        this.setState({
            modalVisible: true,
            equipId:id,
        });
    }
    showUpdate=(ev,id,name)=>{
        this.setState({
            addOrChange:false,
            drawerVisible: true,
            equipName:name,
            equipId:id,
        });
    }
    showAddEquip=()=>{
        this.setState({
            addOrChange:true,
            drawerVisible: true,
            equipName:"",
        });
    }
    equipNameChange=(e)=>{
        this.setState({
            equipName: e.target.value,
        });
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    /////////////////////////////////////////////////////////////////////
    //insertOne
    insertOne = () =>{
        const url=golbal.localhostUrl+"equip/insertOne?equipName="+this.state.equipName;
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
            this.selectAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //updateOne
    updateOne = () =>{
        const url=golbal.localhostUrl+"equip/updateOne?equipName="+this.state.equipName+"&equipId="+this.state.equipId;
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
            this.selectAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //deleteOne
    deleteOne = () =>{
        const url=golbal.localhostUrl+"equip/deleteOne?equipId="+this.state.equipId;
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
            this.selectAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //获取会议室列表
    getEffectiveMeetroom=()=>{
        const url=golbal.localhostUrl+"meetRoom/getEffectiveMeetroom";
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
            this.setState({
                roomList:data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //提交预定
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const url=golbal.localhostUrl+"openApply/insertOne";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials:"include",//跨域携带cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    beginDate:values.beginDate.format("YYYY-MM-DD"),
                    overDate:values.overDate.format("YYYY-MM-DD"),
                    meetRoomId:values.meetRoomId,
                    beginTime:values.beginTime.format("HH:mm"),
                    overTime:values.overTime.format("HH:mm"),
                    note:values.note,
                }),
            }).then(function (res) {//function (res) {} 和 res => {}效果一致
                return res.json()
            }).then(json => {
                // get result
                const data = json;
                console.log(data);
                if(data.status){
                    message.success(data.message)
                    this.setState({
                        bookVisible: false,
                    })
                    form.resetFields();
                }else {
                    message.error(data.message);
                }

            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            });

            console.log('Received values of form: ', values);
            console.log("Start Date",values.beginDate.format("YYYY-MM-DD"));
            console.log("End Date",values.overDate.format("YYYY-MM-DD"));
            console.log("会议室ID",values.meetRoomId);
            console.log("Start Time",values.beginTime.format("HH:mm"));
            console.log("End Time",values.overTime.format("HH:mm"));
            console.log("备注",values.note);
            //form.resetFields();//数据清空

        });
    }
    //openApply/userShow显示申请列表
    userShow=()=>{
        const url=golbal.localhostUrl+"openApply/userShow";
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
            this.setState({
                dataSource:data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //
    cancelOne=(id)=>{
        const url=golbal.localhostUrl+"openApply/cancelOne?id="+id;
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
            this.userShow();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    render() {
        const columns=[
            {
                title:"ID",
                key:"id",
                render:(item,data,i)=>{
                    return(<div>{i+1}</div>)
                }
            },{
                title:"Meeting Room Name",
                dataIndex:"meetroom",
                render:(item)=>{
                    return item.name
                }
            },{
                title:"Start Time",
                dataIndex:"beginDate",
                key:"beginDate",
                ...this.getColumnSearchProps("beginDate")
            },{
                title:"End Time",
                dataIndex:"overDate",
                key:"overDate",
                ...this.getColumnSearchProps("overDate")
            },{
                title:"Create Time",
                dataIndex:"createTime",
                key:"createTime",
                ...this.getColumnSearchProps("createTime")
            },{
                title:"Applicant",
                render:(item)=>{

                    return <Tooltip
                        title={
                            <div>
                                联系方式：{item.userinfo.phone}
                                <br/>
                            </div>
                        }
                    >
                        {item.userinfo.name}
                    </Tooltip>
                }
            },{
                title:"State",
                dataIndex:"status",
                render:(item)=>{
                    switch (item) {
                        case 0:
                            return "Not Processed"
                        case 1:
                            return "Pass"
                        case 2:
                            return "Fail"
                        case 3:
                            return "Cancel"
                        default:
                            return null
                    }
                }
            },{
                title:"Operation",
                render:(item)=>{
                    return(
                        <div>
                            <Tooltip title="Cancel Application">
                                <Button onClick={()=>{this.cancelOne(item.id)}}><Icon style={{color:"red"}} type="delete" /></Button>
                            </Tooltip>
                        </div>
                    )
                }
            }
        ];
        return (
            <div >
                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={<h2 style={{float:'left',marginBottom:-3}}>Open Application</h2>}
                            extra={
                                <div style={{width:200}} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddEquip}>Application</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <OpenDoorCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList}
                    visible={this.state.drawerVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                >
                </OpenDoorCreateForm>

            </div>
        );
    }
}

export default DoorApply;
