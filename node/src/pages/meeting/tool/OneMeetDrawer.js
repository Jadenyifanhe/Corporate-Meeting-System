import React, { Component } from 'react';
import {Button, Card, Col, DatePicker, Drawer, Input, Modal, Row, TimePicker, Form, Select, Table, Icon} from "antd";
import golbal from '@/golbal';
import Highlighter from "react-highlight-words";
const OneMeetDrawer = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends Component {
        componentDidMount(){
            this.getGroupList();
            this.selectPeople();
            this.props.form.setFieldsValue({
                continuedTime: [],
                description: [],
                groups: [],
                guests: [],
                meetingRoom: [],
                others: [],
                prepareTime: [],
                title: [],
            });
        }
        state={
            selectedGroup: [],//已经被选中的群组
            selectedUsers: [],//已经被选中的人
            departList:[],
            userList : [],
            userGroup:[],
            groupList:[],
            othersDisplay:false,
            othersName:"",
            othersPhone:"",
            othersList:[],
            dataSource:[
                {
                    "beginTime": "2019-01-29 15:30",
                    "overTime": "2019-02-01 15:45",
                    "note": "111",
                    "peopleName": "桥东",
                    "peoplePhone": "15088754378",
                    "coordinateId": 2
                }
            ],
        };

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

        showOthers=()=>{
            this.setState({
                othersName:"",
                othersPhone:"",
                othersDisplay:true
            })
        }
        handleOk = (e) => {
            const othersList=this.state.othersList;
            othersList.push({
                name:this.state.othersName,
                phone:this.state.othersPhone,
            })
            console.log(othersList)
            //内存中添加名字与信息
            this.setState({
                othersList:othersList
            },function () {
                this.props.getOthersList(this.state.othersList)
            })
            //列表中添加名字
            const form = this.props.form.getFieldsValue();
            console.log(form)
            const others=form.others;
            others.push(this.state.othersName)
            this.props.form.setFieldsValue({
                others:others
            })
            this.setState({
                othersDisplay: false,
            });
        }
        handleCancel = (e) => {
            this.setState({
                othersDisplay: false,
            });
        }
        changeName=(e)=>{
            this.setState({
                othersName:e.target.value,
            })
        }
        changePhone=(e)=>{
            this.setState({
                othersPhone:e.target.value,
            })
        }
        setOthersList=()=>{
            console.log(this.props.othersList)
            this.setState({
                othersList:this.props.othersList,
            })
        }
        //////////////////////////////////////////////////fetch接口////////////////////////////////////////////////////////////
        //获取群组列表
        getGroupList = () =>{
            const url=golbal.localhostUrl+"meeting/getGroupList";
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
                    groupList:data.data,
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            });
        }
        //selectPeople获取全部人员列表
        selectPeople = () =>{
            console.log("select")
            const url=golbal.localhostUrl+"meeting/selectPeople";
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
                    departList:data.data[0],
                    userList:data.data[1],
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            });
        }
        //agree 同意调用
        agree = (ev,text) => {
            console.log(ev)
            console.log(text)
            const url = golbal.localhostUrl + "meeting/agreeCoordinate?coordinateId=" + text;
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",//跨域携带cookie
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
            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            });
        }
        //disAgree 同意调用
        disAgree = (ev,text) => {
            console.log(ev)
            console.log(text)
            const url = golbal.localhostUrl + "meeting/disagreeCoordinate?coordinateId=" + text;
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",//跨域携带cookie
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
            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            });
        }
        //this.handleChange点击后显吧群组人员添加到参会人员中
        groupChange=(e)=>{
            console.log(e)
            this.setState({
                selectedGroup:e
            },()=>{
                const selectedUsers=[];
                this.state.selectedGroup.map((item,i)=> {
                    const url=golbal.localhostUrl+"meeting/showOneGroup?groupId="+item;
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
                        // const selectedUsers = data.data[1].filter(o => !this.state.selectedUsers.includes(o.userId));
                        data.data[1].map((item)=>{
                            selectedUsers.includes(item.userId)?selectedUsers.push():selectedUsers.push(item.userId)
                            // selectedUsers.includes(item.userId)?null:selectedUsers.push(item.userId)
                            return null;
                        })
                        console.log(selectedUsers)
                        //跟新数据
                        this.props.form.setFieldsValue({
                            guests:selectedUsers
                        })
                    }).catch(function (e) {
                        console.log("fetch fail");
                        alert('system error');
                    });
                    return null;
                })
                //刷新
                this.props.form.setFieldsValue({
                    guests:selectedUsers
                })
            })


        }

        userChange=(e)=>{
            console.log(e)
            this.props.form.setFieldsValue({
                guests:e
            })
        }
        othersChange=(e)=>{
            console.log("第e步",e)
            const L=this.state.othersList.filter((item,i)=>{
                let flag=false
                e.map(item2=>item.name===item2?flag=true:null)
                console.log(i+":"+flag)
                return flag;
            })
            console.log("L=",L)
            this.setState({
                othersList:L
            },function () {
                this.props.getOthersList(this.state.othersList);
            })
            this.props.form.setFieldsValue({
                others:e
            })
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        render() {
            const columns = [{
                title: '开始时间',
                dataIndex: 'beginTime',
                key: 'beginTime',
            },{
                title: '结束时间',
                dataIndex: 'overTime',
                key: 'overTime',
            },{
                title: '调用原因',
                dataIndex: 'note',
                key: 'note',
                ...this.getColumnSearchProps("note"),
            },{
                title: 'Applicant',
                dataIndex: 'peopleName',
                key: 'peopleName',
                ...this.getColumnSearchProps("peopleName"),
            },{
                title: 'Phone',
                dataIndex: 'peoplePhone',
                key: 'peoplePhone',
                ...this.getColumnSearchProps("peoplePhone"),
            },{
                title: 'Operation',
                dataIndex: 'coordinateId',
                key: 'coordinateId',
                render:(text)=>{
                    return(
                        <div>
                            <Button onClick={(ev)=>{this.agree(ev,text)}}>同意</Button>
                            <Button onClick={(ev)=>{this.disAgree(ev,text)}}>拒绝</Button>
                        </div>

                    )
                }
            },
            ];
            const {
                visible, onClose,onCreate, form,
            } = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: { span: 6 },
                wrapperCol: { span: 12 },
            };
            const formItemLayout2 = {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
            };
            const timeList=[];
            let i=0;
            for(i=-15;i<=1440;){
                i+=15;
                timeList.push(i)
            }

            return (
                <Drawer
                    title={this.props.changeAble?
                        (<Button
                            href="#"
                            type={"primary"}
                            onClick={onCreate}
                            disabled={!this.props.changeAble}
                        >
                                {this.props.coordinate?this.props.rob?"抢":"申请调用":"Save"}
                        </Button>)
                        :""
                    }
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                    width={"60%"}
                >
                    <Card>
                        <Form layout="vertical">
                            <Form.Item
                                {...formItemLayout}
                                label="Tittle"
                            >
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: 'Please enter a meeting subject!' }],
                                })(
                                    <Input disabled={!this.props.changeAble} />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="Meeting Room"

                            >
                                {getFieldDecorator('meetingRoom',{
                                        rules: [{required: true, message: 'Please choose a meeting room!' }],
                                    }
                                )(
                                    <Select
                                        disabled={this.props.coordinate||!this.props.changeAble}
                                        style={{ width: 120 }}
                                        onChange={()=>{}}
                                    >
                                        {this.props.roomList.map((item,i)=>{//roomList是后台数据列表
                                            return(
                                                <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                            )
                                        })}
                                    </Select>
                                )}
                            </Form.Item>
                            <Row
                                style={{display:this.props.coordinate?this.props.rob?"block":"none":"block"}}//调用会议不显示
                            >
                                <Col span={6} >
                                    <Form.Item
                                        label="Date"
                                    >
                                        {getFieldDecorator('dateTime', {
                                            rules: [{ type: 'object', required: true, message: 'Please enter a date!' }],
                                        })(
                                            <DatePicker
                                                placeholder="Select Date"
                                                disabled={!this.props.changeAble}
                                                // disabled={!this.props.changeAble||this.props.rob}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Start Time"
                                    >
                                        {getFieldDecorator('startTime', {
                                            rules: [{ type: 'object', required: true, message: 'Please enter a start time!' }],
                                        })(
                                            <TimePicker
                                                placeholder="Select Time"
                                                minuteStep={15}
                                                format={'HH:mm'}
                                                disabled={!this.props.changeAble}
                                                // disabled={!this.props.changeAble||this.props.rob}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Preparation Time"
                                    >
                                        {getFieldDecorator('prepareTime', {
                                            rules: [{ required: true, message: 'Please enter Preparation Time!' }],
                                        })(
                                            <Select
                                                style={{ width: 140 }}
                                                onChange={()=>{}}
                                                disabled={!this.props.changeAble}
                                                // disabled={!this.props.changeAble||this.props.rob}
                                            >
                                                {timeList.map((item,i)=>{//roomList是后台数据列表
                                                    let T="";
                                                    if(item<60){
                                                        T= (item+"分钟")
                                                    }else{
                                                        if(item%60===0){
                                                            T= (item/60+"小时 ")
                                                        }else{
                                                            T= (item/60-item/60%1+"小时 "+item%60+"分钟")
                                                        }
                                                    }
                                                    return(
                                                        <Select.Option value={item} key={i}>{T}</Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Duration"
                                    >
                                        {getFieldDecorator('continuedTime', {
                                            rules: [{ required: true, message: 'Please enter the meeting duration!' }],
                                        })(
                                            <Select
                                                style={{ width: 140 }}
                                                onChange={()=>{}}
                                                disabled={!this.props.changeAble}
                                                // disabled={!this.props.changeAble||this.props.rob}
                                            >
                                                {timeList.map((item,i)=>{//roomList是后台数据列表
                                                    let T="";
                                                    if(item<60){
                                                        T= (item+"分钟")
                                                    }else{
                                                        if(item%60===0){
                                                            T= (item/60+"小时 ")
                                                        }else{
                                                            T= (item/60-item/60%1+"小时 "+item%60+"分钟")
                                                        }
                                                    }
                                                    return(
                                                        <Select.Option value={item} key={i}>{T}</Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row
                                style={{display:this.props.coordinate?this.props.rob?"none":"block":"none"}}
                            >
                                <Col span={6} >
                                    <Form.Item
                                        label="调用区间"
                                    >
                                        {getFieldDecorator('beforeOrLast', {
                                            rules: [{ required: true, message: '请选择调用的区间！' }],
                                        })(
                                            <Select
                                                style={{ width: 140 }}
                                                onChange={()=>{}}
                                                disabled={!this.props.changeAble}
                                            >
                                                <Select.Option value={1} key={1}>开始后</Select.Option>
                                                <Select.Option value={2} key={2}>结束前</Select.Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Duration"
                                    >
                                        {getFieldDecorator('continuedTime', {
                                            rules: [{ required: true, message: 'Please enter the meeting duration!' }],
                                        })(
                                            <Select
                                                style={{ width: 140 }}
                                                onChange={()=>{}}
                                                disabled={!this.props.changeAble}
                                            >
                                                {timeList.map((item,i)=>{//roomList是后台数据列表
                                                    let T="";
                                                    if(item<60){
                                                        T= (item+"分钟")
                                                    }else{
                                                        if(item%60===0){
                                                            T= (item/60+"小时 ")
                                                        }else{
                                                            T= (item/60-item/60%1+"小时 "+item%60+"分钟")
                                                        }
                                                    }
                                                    return(
                                                        <Select.Option value={item} key={i}>{T}</Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Preparation Time"
                                    >
                                        {getFieldDecorator('prepareTime', {
                                            rules: [{ required: true, message: 'Please enter Preparation Time!' }],
                                        })(
                                            <Select
                                                style={{ width: 140 }}
                                                onChange={()=>{}}
                                                disabled={!this.props.changeAble}
                                            >
                                                {timeList.map((item,i)=>{//roomList是后台数据列表
                                                    let T="";
                                                    if(item<60){
                                                        T= (item+"分钟")
                                                    }else{
                                                        if(item%60===0){
                                                            T= (item/60+"小时 ")
                                                        }else{
                                                            T= (item/60-item/60%1+"小时 "+item%60+"分钟")
                                                        }
                                                    }
                                                    return(
                                                        <Select.Option value={item} key={i}>{T}</Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>

                            </Row>
                            <Form.Item
                                {...formItemLayout}
                                label="Illustrate"
                            >
                                {getFieldDecorator('description')(
                                    <Input.TextArea
                                        rows={5}
                                        disabled={!this.props.changeAble}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="Quickly add group members"
                                style={{display:this.props.changeAble?"block":"none"}}
                            >
                                {getFieldDecorator('groups',{
                                    value:this.state.selectedGroup
                                })(

                                    <Select
                                        mode="multiple"
                                        onChange={this.groupChange}
                                        style={{ width: '100%' }}
                                        disabled={!this.props.changeAble}
                                    >
                                        {this.state.groupList.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="Participants"
                            >
                                {getFieldDecorator('guests',{
                                    rules: [{ required: true, message: 'Please fill in the participants!' }],
                                })(

                                    <Select
                                        mode="multiple"
                                        placeholder="Participants list"
                                        onChange={this.userChange}
                                        style={{ width: '100%' }}
                                        disabled={!this.props.changeAble}
                                    >
                                        {
                                            this.state.departList.map((item,i) => (
                                                <Select.OptGroup key={i} label={item.name}>
                                                    {this.state.userList[i].map((item2) => (
                                                        <Select.Option key={item2.id} value={item2.id}>
                                                            {item2.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select.OptGroup>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Row>
                                <Col span={18}>
                                    <Form.Item
                                        {...formItemLayout2}
                                        label="List of other people"
                                    >
                                        {getFieldDecorator('others',{
                                        })(

                                            <Select
                                                mode="multiple"
                                                placeholder="List of foreign participants"
                                                onChange={this.othersChange}
                                                style={{ width: '100%' }}
                                                disabled={!this.props.changeAble}
                                            >
                                                {
                                                    this.state.othersList.map((item,i) => (
                                                        <Select.Option key={item.name} Option={item}>
                                                            {item.name}
                                                        </Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={4} offset={2}>
                                    <Button
                                        type={"primary"}
                                        onClick={this.showOthers}
                                        disabled={!this.props.changeAble}
                                    >Quick Add</Button>
                                </Col>
                            </Row>
                            <Form.Item
                                {...formItemLayout}
                                label={this.props.rob?"抢会原因":"调用原因"}
                                style={{display:this.props.coordinate?"block":"none"}}
                            >
                                {getFieldDecorator('coordinateNote')(
                                    <Input.TextArea
                                        rows={5}
                                        disabled={!this.props.changeAble}
                                    />
                                )}
                            </Form.Item>
                        </Form>
                        <Row style={{display:this.state.othersDisplay}}>
                        </Row>
                        <Row style={{display:!this.props.changeAble?this.props.coordinate?"none":"none":"block"}}>
                            调用会议申请列表
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.props.dataSource} />
                        </Row>
                        <Modal
                            title="Quickly add participants"
                            visible={this.state.othersDisplay}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            Name：<Input value={this.state.othersName} onChange={this.changeName}></Input>
                            Phone：<Input value={this.state.othersPhone}  onChange={this.changePhone}></Input>
                        </Modal>

                    </Card>
                    {/*<Button onClick={this.setOthersList}/>*/}
                </Drawer>
            );
        }
    }
);

export default OneMeetDrawer;
