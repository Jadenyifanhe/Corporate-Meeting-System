import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Modal, Select} from "antd";
import golbal from '@/golbal';
import Highlighter from 'react-highlight-words';
class EquipRepair extends Component {
    componentDidMount(){
        this.selectAll();
    }
    state={
        id:0,
        meet_room_id:0,
        equip_id:0,
        damage_info:"",
        meetRoomList:[
            {
            "id": 1,
            "name": "Meeting Room 1",
            "num": "A01",
            "place": "办公大楼A01室",
            "contain": 40,
            "availStatus": 1,
            "nowStatus": 0,
            "tenantId": 1,
            "wifiCode": null,
            "qrcodeAddress": null
            }
        ],
        equipList:[],
        dataSource:[
            {
                id:1,
                meetRoomName:"Meeting Room 1",
                downName:"桥东",
                upTime:"2019-02-08 12:21",
                downTime:"2019-02-09 15:21",
                status:"Already Fixed",
            }
        ],
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
            id:id,
        });
    }
    showAddEquip=()=>{
        this.setState({
            id:0,
            addOrChange:true,
            drawerVisible: true,
            equipName:"",
        });
    }
    damage_infoChange=(e)=>{
        this.setState({
            damage_info: e.target.value,
        });
    }
    meetRoomChange=(e)=>{
        console.log(e)
        this.setState({
            meet_room_id:e,
        })
    }
    equipChange=(e)=>{
        console.log(e)
        this.setState({
            equip_id:e,
        })
    }

    /////////////////////////////////////////////////////////////////////
    //insertOne
    insertOne = () =>{
        const url=golbal.localhostUrl+"equip/reportDemage";
        if(this.state.id===0){
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials:"include",//跨域携带cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    meetRoomId:this.state.meet_room_id,
                    equipId:this.state.equip_id,
                    damageInfo:this.state.damage_info,
                }),
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
        }else {
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials:"include",//跨域携带cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    id:this.state.id,
                    meetRoomId:this.state.meet_room_id,
                    equipId:this.state.equip_id,
                    damageInfo:this.state.damage_info,
                }),
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
    //selectAll
    selectAll = () =>{
        this.userGetEquipRequairInfos();
        const url=golbal.localhostUrl+"meetRoom/selectAll";
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
                meetRoomList:data.data[0],
                equipList:data.data[1],
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //userGetEquipRequairInfos
    userGetEquipRequairInfos=()=>{
        const url=golbal.localhostUrl+"equip/userGetEquipRequairInfos";
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
                title:"Meeting Room Name",
                dataIndex:"meetRoomId",
                render:(item)=>{
                    let name=""
                    this.state.meetRoomList.map((room)=>{
                        return item===room.id?
                        name=room.name:null
                    })
                    return name
                }
            },{
                title:"Device Name",
                dataIndex:"equipId",
                render:(item)=>{
                    let name=""
                    this.state.equipList.map((equip)=>{
                        return item===equip.id?
                            name=equip.name:null
                    })
                    return name
                }
            },{
                title:"Repairman",
                dataIndex:"repairName",
            },{
                title:"Maintenance Time",
                dataIndex:"repairTime",
            },{
                title:"Repair Information",
                dataIndex:"damageInfo"
            },{
                title:"State",
                dataIndex:"status",
                render:(item)=>{
                    switch (item) {
                        case 0 :
                            return "Not Processed"
                        case 1 :
                            return "Already Fixed"
                        default :
                            return item
                    }
                }
            },{
                title:"Operation",
                render:(item)=>{
                    return(
                        <div>
                            <Tooltip title="修改">
                                <Button onClick={(ev)=>{this.showUpdate(ev,item.id,item.name)}}><Icon type="edit" /></Button>
                            </Tooltip>
                            {/*<Tooltip title="Delete">*/}
                                {/*<Button onClick={(ev)=>{this.showDelete(ev,item.id)}}><Icon style={{color:"red"}}type={"delete"}></Icon></Button>*/}
                            {/*</Tooltip>*/}
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
                            title={<h2 style={{float:'left',marginBottom:-3}}>Equipment Repair</h2>}
                            extra={
                                <div style={{width:200}} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddEquip}>Repair</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <Drawer
                    title={<Button href="#" type={"primary"} onClick={this.insertOne}>报修</Button>}


                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawerVisible}
                    width={"60%"}
                >
                    <Card>
                        Meeting Room Name：
                        <Select style={{ width: 120 }} onChange={this.meetRoomChange}>
                            {
                                this.state.meetRoomList.map((item,j)=>{
                                    return <Select.Option key={j} value={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                        Device Name：
                        <Select style={{ width: 120 }} onChange={this.equipChange}>
                            {
                                this.state.equipList.map((item,j)=>{
                                    return <Select.Option key={j} value={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                        <br/>
                        Reason for repair：
                        <Input value={this.state.damage_info} onChange={this.damage_infoChange}/>
                    </Card>
                </Drawer>
            </div>
        );
    }
}

export default EquipRepair;
