import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Modal} from "antd";
import golbal from '@/golbal';
import Highlighter from 'react-highlight-words';
import DoorCreateForm from "@/pages/manage/tool/DoorCreateForm";
class DoorApply extends Component {
    componentDidMount(){
        //this.selectAll();
        this.getEffectiveMeetroom();
        this.manageShow();
        this.selectAllPeople();
    }
    state={
        dataSource:[],
        roomList:[],
        userList:[[],[],[],[]],
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
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    showAddEquip=()=>{
        this.setState({
            drawerVisible: true,
        });
    }

    /////////////////////////////////////////////////////////////////////
    agreeOne=(id)=>{
        const url=golbal.localhostUrl+"openApply/agreeOne?id="+id;
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
            this.manageFindAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    disagreeOne=(id)=>{
        const url=golbal.localhostUrl+"openApply/disagreeOne?id="+id;
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
            this.manageFindAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //获取用户列表
    selectAllPeople=()=>{
        const url=golbal.localhostUrl+"userInfo/selectAllPeople";
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
                userList:data.data,
            })
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

            const url=golbal.localhostUrl+"openApply/insertByManage";
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
                    userId:values.userId,
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
                        drawerVisible: false,
                    })
                    form.resetFields();
                    this.manageShow();
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
    //openApply/manageShow显示申请列表
    manageShow=()=>{
        const url=golbal.localhostUrl+"openApply/manageShow";
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
            this.manageShow();
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
                title:"Admission Time",
                render:(item=>{
                    return item.beginTime+"-"+item.overTime
                })
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
                            <Tooltip title="通过">
                                <Button onClick={()=>{this.agreeOne(item.id)}}><Icon type="check" /></Button>
                            </Tooltip>
                            <Tooltip title="不通过/取消权限">
                                <Button onClick={()=>{this.disagreeOne(item.id)}}><Icon style={{color:"red"}} type="close" /></Button>
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
                                            <Button type="primary" onClick={this.showAddEquip}>申请</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <DoorCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList}
                    userList={this.state.userList}
                    visible={this.state.drawerVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                >
                </DoorCreateForm>

            </div>
        );
    }
}

export default DoorApply;
