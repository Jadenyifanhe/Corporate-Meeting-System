import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Modal} from "antd";
import golbal from '@/golbal';
import Highlighter from 'react-highlight-words';
class WeekMeetManage extends Component {
    componentDidMount(){
        this.manageFindAll();
    }
    state={
        dataSource:[],
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
    agreeOne=(id)=>{
        const url=golbal.localhostUrl+"weekMeeting/agreeOne?id="+id;
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
        const url=golbal.localhostUrl+"weekMeeting/disagreeOne?id="+id;
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
    //manageFindAll
    manageFindAll = () =>{
        const url=golbal.localhostUrl+"weekMeeting/manageFindAll";
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
                title:"Meeting Start Time",
                dataIndex:"meetBegin",
                key:"meetBegin",
                ...this.getColumnSearchProps("meetBegin")
            },{
                title:"Meeting End Time",
                dataIndex:"meetOver",
                key:"meetOver",
                ...this.getColumnSearchProps("meetOver")
            },,{
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
                                部门：{item.depart.name}
                                <br/>
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
                            <Tooltip title="Fail">
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
                            title={<h2 style={{float:'left',marginBottom:-3}}>Weekly Meeting Management</h2>}
                        >
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default WeekMeetManage;
