import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Drawer, Input} from "antd";
import golbal from '@/golbal';
import Highlighter from "react-highlight-words";

class JoinPersonManage extends Component {
    componentDidMount(){
        this.toJoinPersonIndex();
    }
    state={
        dataSource:[],
        joinDataSource:[],
        equipName:"",
        meetingId:0,
        drawerVisible:false,
        addOrChange:false,
        modalVisible: false,
    }
    //表格查询...this.getColumnSearchProps("name"),
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

    onClose = (e) => {
        console.log(e);
        this.setState({
            drawerVisible: false,
        });
    }
    /////////////////////////////////////////////////////////////////////
    //remindOne 提醒未签到的用户
    remindOne=(ev,id)=>{
        const url=golbal.localhostUrl+"joinPerson/remindOne?meetingId="+this.state.meetingId+"&userId="+id;
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
    //showOneMeeting
    showOneMeeting=(ev,id)=>{
        const url=golbal.localhostUrl+"joinPerson/showOneMeeting?meetingId="+id;
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
                meetingId:id,
                drawerVisible:true,
                joinDataSource:data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
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
            this.toJoinPersonIndex();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //toJoinPersonIndex
    toJoinPersonIndex = () =>{
        const url=golbal.localhostUrl+"joinPerson/toJoinPersonIndex";
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
                drawerVisible:false,
            })
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
                title:"Meeting Name",
                dataIndex:"topic",
                key:"topic",
                ...this.getColumnSearchProps("topic"),
            },{
                title:"Start Time",
                dataIndex:"begin",
                key:"begin",
                ...this.getColumnSearchProps("begin"),
            },{
                title:"End Time",
                dataIndex:"over",
                key:"over",
                ...this.getColumnSearchProps("over"),
            },{
                title:"Operation",
                render:(item)=>{
                    return(
                        <div>
                            <Tooltip title="查看此会议">
                                <Button onClick={(ev)=>{this.showOneMeeting(ev,item.id)}}><Icon type={"eye"}></Icon></Button>
                            </Tooltip>
                        </div>
                    )
                }
            }
        ];
        const joinColumns=[
            {
                title:"ID",
                key:"recordId",
                render:(item,data,i)=>{
                    return(<div>{i+1}</div>)
                }
            },{
                title:"User Name",
                dataIndex:"userName",
                key:"userName",
                ...this.getColumnSearchProps("userName"),
            },{
                title:"Phone",
                dataIndex:"userPhone",
                key:"userPhone",
                ...this.getColumnSearchProps("userPhone"),
            },{
                title:"Check-in state",
                dataIndex:"status",
                key:"status",
                ...this.getColumnSearchProps("status"),
            },{
                title:"Check-in Time",
                dataIndex:"signTime",
            },{
                title:"Operation",
                render:(item)=>{
                    if(item.status==="未签到"){
                        return(
                            <div>
                                <Tooltip title="Remind">
                                    <Button onClick={(ev)=>{this.remindOne(ev,item.id)}}><Icon type="exclamation" /></Button>
                                </Tooltip>
                            </div>
                        )
                    }else{
                        return null;
                    }
                }
            }
        ];
        return (
            <div >
                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={<h2 style={{float:'left',marginBottom:-3}}>Meeting Check-in Management</h2>}
                        >
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <Drawer
                    title={
                        this.state.addOrChange?
                            <Button href="#" type={"primary"} onClick={this.insertOne}>Add</Button>
                            :
                            <Button href="#" type={"primary"} onClick={this.updateOne}>Save</Button>
                    }
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawerVisible}
                    width={"60%"}
                >
                    <Card>
                    Sign in status:
                        <Table rowKey={record=>record.recordId} className={'table'} columns={joinColumns} dataSource={this.state.joinDataSource} />
                    </Card>
                </Drawer>
            </div>
        );
    }
}

export default JoinPersonManage;
