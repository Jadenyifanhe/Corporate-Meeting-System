import React, { Component } from 'react';
import {Button, Card, Col, Input, message, Row,} from "antd";
import golbal from '@/golbal';

class MeetParaManage extends Component {
    componentDidMount(){
        this.toMeetRoomPara();
    }
    state={
        id:"",
        begin:"",
        over:"",
        dateLimit:"",
        timeLimit:"",
        timeInterval:"",
    }
    beginChange=(e)=>{
        this.setState({
            begin: e.target.value,
        });
    }
    overChange=(e)=>{
        this.setState({
            over: e.target.value,
        });
    }
    dateLimitChange=(e)=>{
        this.setState({
            dateLimit: e.target.value,
        });
    }
    timeLimitChange=(e)=>{
        this.setState({
            timeLimit: e.target.value,
        });
    }
    timeIntervalChange=(e)=>{
        this.setState({
            timeInterval: e.target.value,
        });
    }
    /////////////////////////////////////////////////////////////////////////////////
    //toMeetRoomPara显示全部数据
    toMeetRoomPara = () =>{
        const url=golbal.localhostUrl+"MeetRoomPara/toMeetRoomPara";
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
                id:data.data.id,
                begin:data.data.begin,
                over:data.data.over,
                dateLimit:data.data.dateLimit,
                timeLimit:data.data.timeLimit,
                timeInterval:data.data.timeInterval,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //updateMeetRoomPara
    updateMeetRoomPara = () =>{
        const url=golbal.localhostUrl+"MeetRoomPara/updateMeetRoomPara";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                id:this.state.id,
                begin:this.state.begin,
                over:this.state.over,
                dateLimit:this.state.dateLimit,
                timeLimit:this.state.timeLimit,
                timeInterval:this.state.timeInterval,
            }),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if(data.status){
                message.success("保存成功！")
            }else{
                message.warning("请检查网络连接！")
            }
            this.toMeetRoomPara();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //resetMeetRoomPara 恢复出厂设置
    resetMeetRoomPara = () =>{
        const url=golbal.localhostUrl+"MeetRoomPara/resetMeetRoomPara?id="+this.state.id;
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
                message.success("保存成功！")
            }else{
                message.warning("请检查网络连接！")
            }
            this.toMeetRoomPara();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }

    render() {
        return (
            <div >
                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={<h2 style={{float:'left',marginBottom:-3}}>参数管理</h2>}
                            extra={
                                <div style={{width:200}} >
                                    <Row>
                                        <Col span={12}>
                                            <Button href="#" type={"primary"} onClick={this.updateMeetRoomPara} >Save</Button>
                                        </Col>
                                        <Col span={12}>
                                            <Button href="#" onClick={this.resetMeetRoomPara} >恢复出厂设置</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }>
                            Earliest daily meeting start time:
                            <Input value={this.state.begin} onChange={this.beginChange}/>
                            Daily meeting latest end time:
                            <Input value={this.state.over} onChange={this.overChange}/>
                            Scheduled period:
                            <Input value={this.state.dateLimit} onChange={this.dateLimitChange}/>
                            Maximum meeting time:
                            <Input value={this.state.timeLimit} onChange={this.timeLimitChange}/>
                            Time interval:
                            <Input value={this.state.timeInterval} onChange={this.timeIntervalChange}/>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default MeetParaManage;
