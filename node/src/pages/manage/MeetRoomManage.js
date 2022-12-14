import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Tree, Badge} from "antd";
import golbal from '@/golbal';
import Highlighter from "react-highlight-words";

class MeetRoomManage extends Component {
    componentDidMount(){
        this.selectAll();
    }
    state={
        dataSource:[],
        allMenuList:[],
        allDepartList:[],
        drawerVisible: false,
        roomName:"",
        num:"",
        place:"",
        contain:"",
        menuList:[],
        addOrChange:true,
        roleId:0,
        checkedKeys:[],
        checkedDepartKeys:[],
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

    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    };
    showDrawer=(e)=>{
        this.setState({
            drawerVisible: true,
            id:e
        });
    }
    showAddRole=()=>{
        this.setState({
            roomName:"",
            num:"",
            place:"",
            contain:"",
            menuList:[],
            drawerVisible: true,
            addOrChange:true,
            checkedKeys:[],
            checkedDepartKeys:[],

        });
    }
    roomNameChange=(e)=>{
        this.setState({
            roomName: e.target.value,
        });
    }
    numChange=(e)=>{
        this.setState({
            num: e.target.value,
        });
    }
    placeChange=(e)=>{
        this.setState({
            place: e.target.value,
        });
    }
    containChange=(e)=>{
        this.setState({
            contain: e.target.value,
        });
    }
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }
    departOnCheck = (checkedDepartKeys, info) => {
        console.log('onCheck', checkedDepartKeys, info);
        this.setState({
            checkedDepartKeys:checkedDepartKeys,
        })
    }
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        this.setState({
            checkedKeys:checkedKeys,
        })
    }
    /////////////////////////////////////////////////////////////////////
    //insertOne
    insertOne = () =>{
        const url=golbal.localhostUrl+"meetRoom/insertOne";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                roleId:this.state.roleId,
                name:this.state.roomName,
                num:this.state.num,
                place:this.state.place,
                contain:this.state.contain,
                equips:this.state.checkedKeys,
                enables:this.state.checkedDepartKeys,
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
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //updateOne
    updateOne = () =>{
        const url=golbal.localhostUrl+"meetRoom/editOne";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                id:this.state.id,
                roleId:this.state.roleId,
                name:this.state.roomName,
                num:this.state.num,
                place:this.state.place,
                contain:this.state.contain,
                equips:this.state.checkedKeys,
                enables:this.state.checkedDepartKeys,
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
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //showOne
    showOne = (ev,id,name,num,place,contain) =>{
        console.log(ev)
        console.log(id)
        const url=golbal.localhostUrl+"meetRoom/showOne?MeetRoomId="+id;
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
            let checkedKeys=[];
            let checkedDepartKeys=[];
            data.data[2].map( item =>{
                return checkedKeys.push(item.equipId);
            })
            data.data[4].map( item =>{
                return checkedDepartKeys.push(item.departId);
            })
            this.setState({
                id:id,
                drawerVisible:true,
                roomName:data.data[0].name,
                num:data.data[0].num,
                place:data.data[0].place,
                contain:data.data[0].contain,
                checkedKeys:checkedKeys,
                checkedDepartKeys:checkedDepartKeys,
                addOrChange:false,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //banOne
    banOne = (ev,text) =>{
        console.log(ev)
        console.log(text)
        const url=golbal.localhostUrl+"meetRoom/banOne?MeetRoomId="+text;
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
            this.selectAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //enableOne
    enableOne = (ev,text) =>{
        console.log(ev)
        console.log(text)
        const url=golbal.localhostUrl+"meetRoom/enableOne?MeetRoomId="+text;
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
            this.selectAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //deleteOne
    deleteOne = (ev,text) =>{
        console.log(ev)
        console.log(text)
        const url=golbal.localhostUrl+"meetRoom/deleteOne?MeetRoomId="+text;
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
                dataSource:data.data[0],
                allMenuList:data.data[1],
                allDepartList:data.data[2],
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
                title:"Name",
                dataIndex:"name",
                key:"name",
                ...this.getColumnSearchProps("name"),
            },{
                title:"Number",
                dataIndex:"num",
                key:"num",
                ...this.getColumnSearchProps("num"),
            },{
                title:"Place",
                dataIndex:"place",
                key:"place",
                ...this.getColumnSearchProps("place"),
            },{
                title:"Contain",
                dataIndex:"contain",
                key:"contain",
                ...this.getColumnSearchProps("contain"),
            },{
                title:"Enabled State",
                dataIndex:"availStatus",
                key:"availStatus",
                render:(item)=>{
                    if(item===1){
                        return(<Badge status="success">Available</Badge>)
                    }else{
                        return(<Badge status="default">Disabled</Badge>)
                    }
                }
            },{
                title:"Current State",
                dataIndex:"nowStatus",
                key:"nowStatus",
                render:(item)=>{
                    if(item===0){
                        return(<Badge status="success">Available</Badge>)
                    }else{
                        return(<Badge status="warning">Using</Badge>)
                    }
                }
            },{
                title:"Operation",
                render:(item)=>{
                    return(
                        <div>
                            <Tooltip title="Check">
                                <Button onClick={(ev)=>{this.showOne(ev,item.id,item.name,item.num,item.place,item.contain)}}><Icon type={"eye"}></Icon></Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Button onClick={(ev)=>{this.deleteOne(ev,item.id)}}><Icon style={{color:"red"}}type={"delete"}></Icon></Button>
                            </Tooltip>
                            {
                                item.availStatus===0?
                                    <Tooltip title="Enable">
                                        <Button onClick={(ev)=>{this.enableOne(ev,item.id)}}><Icon type="unlock" /></Button>
                                    </Tooltip>:
                                    <Tooltip title="Disabled">
                                        <Button onClick={(ev)=>{this.banOne(ev,item.id)}}><Icon type="lock" /></Button>
                                    </Tooltip>
                            }

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
                            title={<h2 style={{float:'left',marginBottom:-3}}>Meeting Room Management</h2>}
                            extra={
                                <div style={{width:200}} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddRole}>Add Meeting Room</Button>
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
                        Meeting Room Name:
                        <Input value={this.state.roomName} onChange={this.roomNameChange}/>
                        Room Number:
                        <Input value={this.state.num} onChange={this.numChange}/>
                        Meeting Room Address:
                        <Input value={this.state.place} onChange={this.placeChange}/>
                        Meeting Room Capacity: (people)
                        <Input value={this.state.contain} onChange={this.containChange}/>
                        Have Equipment:
                        <Tree
                            checkable
                            onSelect={this.onSelect}
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                        >

                            {
                                this.state.allMenuList.map((item)=>{
                                    return(
                                        <Tree.TreeNode title={item.name} key={item.id}>

                                        </Tree.TreeNode>
                                    )
                                })
                            }
                        </Tree>
                        Available Departments:
                        <Tree
                            checkable
                            onCheck={this.departOnCheck}
                            checkedKeys={this.state.checkedDepartKeys}
                        >
                            <Tree.TreeNode title="All Departments" key={0}>
                                {
                                    this.state.allDepartList.map((item)=>{
                                        return(
                                            <Tree.TreeNode title={item.name} key={item.id}>

                                            </Tree.TreeNode>
                                        )
                                    })
                                }
                            </Tree.TreeNode>
                        </Tree>


                    </Card>
                </Drawer>
            </div>
        );
    }
}

export default MeetRoomManage;
