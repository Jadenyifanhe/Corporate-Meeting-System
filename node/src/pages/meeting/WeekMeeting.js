import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Modal} from "antd";
import golbal from '@/golbal';
import Highlighter from 'react-highlight-words';
import WeekMeetCreateForm from "@/pages/meeting/tool/WeekMeetCreateForm";
class WeekMeeting extends Component {
    componentDidMount(){
        //this.selectAll();
        this.getEffectiveMeetroom();
        this.userFindAll();
    }
    state={
        dataSource:[
        ],
        roomList:[],
        equipName:"",
        equipId:0,
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

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
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

    /////////////////////////////////////////////////////////////////////
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
    cancelOne=(id)=>{
        const url=golbal.localhostUrl+"weekMeeting/cancelOne?id="+id;
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
            this.userFindAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //userFindAll
    userFindAll = () =>{
        const url=golbal.localhostUrl+"weekMeeting/userFindAll";
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
                dataSource:data.data
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

            const url=golbal.localhostUrl+"weekMeeting/insertOne";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials:"include",//跨域携带cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    beginTime:values.beginTime.format("YYYY-MM-DD"),
                    overTime:values.overTime.format("YYYY-MM-DD"),
                    week:values.week,
                    meetRoomId:values.meetRoomId,
                    meetBegin:values.meetBegin.format("HH:mm"),
                    meetOver:values.meetOver.format("HH:mm"),
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
            console.log("Start Date",values.beginTime.format("YYYY-MM-DD"));
            console.log("End Date",values.overTime.format("YYYY-MM-DD"));
            console.log("Week",values.week);
            console.log("会议室ID",values.meetRoomId);
            console.log("Start Time",values.meetBegin.format("HH:mm"));
            console.log("End Time",values.meetOver.format("HH:mm"));
            console.log("备注",values.note);
            //form.resetFields();//数据清空

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
                title:"Meeting Room",
                render:(item)=>{
                    return item.meetroom.name
                }
            },{
                title:"Week",
                dataIndex:"week",
                render:(item)=>{
                    switch (item) {
                        case 0:
                            return "Sunday"
                        case 1:
                            return "Monday"
                        case 2:
                            return "Tuesday"
                        case 3:
                            return "Wednesday"
                        case 4:
                            return "Thursday"
                        case 5:
                            return "Friday"
                        case 6:
                            return "Saturday"
                        default:
                            return null
                    }
                }
            },{
                title: "Meeting Start Time",
                dataIndex:"meetBegin",
                key:"meetBegin",
                ...this.getColumnSearchProps("meetBegin")
            },{
                title:"Meeting End Time",
                dataIndex:"meetOver",
                key:"meetOver",
                ...this.getColumnSearchProps("meetOver")
            },{
                title:"Create Time",
                dataIndex:"createTime",
                key:"createTime",
                ...this.getColumnSearchProps("createTime")
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
                            <Tooltip title="Cancel Weekly Meeting">
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
                            title={<h2 style={{float:'left',marginBottom:-3}}>Weekly Meeting</h2>}
                            extra={
                                <div style={{width:200}} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddEquip}>Application For Meeting</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <WeekMeetCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList}
                    visible={this.state.drawerVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                >
                </WeekMeetCreateForm>
                <Modal
                    visible={this.state.modalVisible}
                    onOk={this.deleteOne}
                    onCancel={this.handleCancel}
                    okText={"Ok"}
                    cancelText={"Cacel"}
                >
                    <h3>Are you sure you want to delete this device</h3>
                </Modal>
            </div>
        );
    }
}

export default WeekMeeting;
