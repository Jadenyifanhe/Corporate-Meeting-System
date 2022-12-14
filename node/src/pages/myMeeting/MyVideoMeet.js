import React, { Component } from 'react';
import {Button, Card, Col, Icon, Row, Table, Tooltip, message} from 'antd'
import golbal from '@/golbal';
import VideoCreateForm from "@/pages/myMeeting/tool/VideoCreateForm"

class MyVideoMeet extends Component {
    //任务：
    //2。添加视频会议
    //3。结束视频会议
    //4。创建者只显示一个视频会议
    componentDidMount(){
        this.selectMyVideoRoom();
    }
    state={
        userId:"12321",
        userSig:"eJw1j1FPgzAURv8LrxpTSgto4kNdptkCycjWMPbSNLSbFwYiu1bR*N*djL2e8-Cd78fbJOs73XVglEYV9MZ78Ih3O2L71UFvld6j7c-Y55xTQq4WjG0R9nBxNKD*JE5wOJN0LmeLF5kXwrbL4w747PTknj8zti1Ncp-jshgyKYM1pmZTV2EjYC5eaz8-YuYc4KpqWLzzY7p1onE3q*9kUekC0kFwmR-ey8frmKnVmP8fwQihJGacTRKhsZfwKGJhRMKJ67J8*2hR4dDZ8e-vH-sAUEs_",
        roomid:"11",
        dataSource:[],
        visible:false,
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    joinMeeting=(id)=>{
        const url=golbal.localhostUrl+"video/joinMeeting";
        this.setState({
            roomid:id,
        },()=>{
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
                    userId:data.data[0],
                    userSig:data.data[2],
                },()=>{
                    window.open("https://www.jglo.top:8091/RTC/index.html?userId="+this.state.userId+"&userSig="+this.state.userSig+"&roomid="+this.state.roomid)
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            })}
        );

    }
    //selectAll
    selectMyVideoRoom = () =>{
        const url=golbal.localhostUrl+"video/selectMyVideoRoom";
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
    //overMeeting
    overMeeting=(id)=>{
        const url1=golbal.localhostUrl+"video/overMeeting?id="+id;
        fetch(url1, {
            method: "POST",
            mode: "cors",//支持跨域
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
                this.selectMyVideoRoom();
            }else {
                message.error(data.message);
            }
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

            const url=golbal.localhostUrl+"video/createMeetRoom";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials:"include",//跨域携带cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    videoRoomName:values.title,
                    userId:values.guests,
                }),
            }).then(function (res) {//function (res) {} 和 res => {}效果一致
                return res.json()
            }).then(json => {
                // get result
                const data = json;
                console.log(data);
                if(data.status){
                    message.success("Booking information submitted successfully!")
                    this.setState({
                        bookVisible: false,
                    })
                    form.resetFields();
                    this.selectMyVideoRoom();
                }else {
                    message.error(data.message);
                }

            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            });

            console.log('Received values of form: ', values);
            console.log("Tittle",values.title);
            console.log("Participants",values.guests);
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
                title:"Video Room Name",
                dataIndex:"videoRoomName",
            },{
                title:"Creator",
                dataIndex:"userinfo",
                render:(item)=>{
                    return item.name
                }
            },{
                title:"Create Time",
                dataIndex:"createTime",
            },{
                title:"Operation",
                render:(item)=>{
                    return(
                        <div>
                            <Tooltip title="Join Video Meeting">
                                <Button onClick={()=>this.joinMeeting(item.id,item.videoRoomName)}><Icon type="login" /></Button>
                            </Tooltip>
                            <Tooltip title="End Meeting">
                                <Button onClick={()=>this.overMeeting(item.id)}><Icon style={{color:"red"}} type="close" /></Button>
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
                            title={<h2 style={{float:'left',marginBottom:-3}}>Video Meeting</h2>}
                            extra={
                                <div style={{width:200}} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={()=>{
                                                this.setState({
                                                    visible:true
                                                })
                                            }
                                            }>Create video meeting</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record=>record.id} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <VideoCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onClose={() => {
                        this.setState({
                            visible:false
                        })
                    }}
                    onCreate={this.handleCreate}
                >
                </VideoCreateForm>
            </div>
        );
    }
}

export default MyVideoMeet;
