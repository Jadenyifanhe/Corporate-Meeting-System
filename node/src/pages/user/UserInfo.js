import React, { Component } from 'react';
import {message,Input,Modal,Button,Card,Row,Col} from "antd";
import golbal from '@/golbal';
import ChangePassword from "@/pages/user/tool/ChangePassword";
class UserInfo extends Component {
    componentDidMount(){
        this.getUserInfo();

    }
    constructor(props){
        super(props);
        this.state = {
            resume:"",
            positionName:"",
            newPhone:"",
            phone:"",
            name:"",
            worknum:"",
            departName:"",
            password:"",
            pwd_code:"!!!",
            phone_code:"",
            disabled_getCode:false,
            codeTime:0,
            disabled_changeBtn:true,
            visible: false,
        }
    }


    /////////////////////////////////////////////////Input输入的及时改变/////////////////////////////////////////////////
    // username被修改
    //手机号被修改
    newPhoneChange=(e)=>{
        this.setState({ newPhone : e.target.value })
    }
    //验证码被修改
    phoneCodeChange=(e)=>{
        this.setState({ phone_code : e.target.value })
    }
    nameChange=(e)=>{
        this.setState({ name : e.target.value })
    }
    departNameChange=(e)=>{
        this.setState({ departName : e.target.value })
    }
    positionNameChange=(e)=>{
        this.setState({ positionName : e.target.value })
    }
    workNumChange=(e)=>{
        this.setState({ workNum : e.target.value })
    }
    phoneChange=(e)=>{
        this.setState({ phone : e.target.value })
    }
    //Introduction被修改
    resumeChange=(e)=>{
        this.setState({ resume : e.target.value })
    }
    /////////////////////////////////////////////////找回密码/////////////////////////////////////////////////
    //验证验证码
    compareCode=()=>{
        if(this.state.phone_code===this.state.pwd_code){
            message.success("Verification succeeded!");
            this.setState({
                visible: false,
            });
            this.changePhone();
        }else {
            message.error("Verification failed!");
        }
    }
    //Get verification code60s
    codeTime=()=>{
        const timer =setInterval(()=> {
            // console.log(this.state.codeTime);
            if(this.state.codeTime>0){
                this.setState({
                    codeTime:this.state.codeTime-1
                });
            }else{
                this.setState({
                    disabled_getCode:false,
                });
                clearInterval(timer);
            }
        }, 1000);
    }
    /////////////////////////////////////////////////对话框/////////////////////////////////////////////////
    //弹出对话框
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    //对话框确定
    handleOk = (e) => {
        console.log(e);
        this.compareCode();
    }
    //对话框取消
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    /////////////////////////////////////////////////请求/////////////////////////////////////////////////
    //get用户信息
    getUserInfo=()=>{
        const url1=golbal.localhostUrl+"showUserinfo";
        // const url1="http://39.106.56.132:8080/showUserinfo";
        fetch(url1, {
            method: "POST",
            //type:"post",
            //url:"http://39.106.56.132:8080/userinfo/tologin",
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
            this.setState(data.data,function () {});

        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }
    //修改
    updateResume=()=>{
        const url1=golbal.localhostUrl+"updateResume?resume="+this.state.resume;
        // const url1="http://39.106.56.132:8080/updateResume?resume="+this.state.resume;
        fetch(url1, {
            method: "POST",
            //type:"post",
            //url:"http://39.106.56.132:8080/userinfo/tologin",
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
            if(data.status){
                message.success("修改成功！");
            }
            console.log(data);
        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });

    }
    //发送验证码请求
    getPhoneCode = () =>{

        const phone=this.state.newPhone;//this.state.username;
        // const url="http://39.106.56.132:8080/getCode?phone="+phone;
        const url=golbal.localhostUrl+"getCode?phone="+phone;
        if(phone===""){
            message.warning("手机号不能为空！");
        }else{
            fetch(url, {
                method: "POST",
                //type:"post",
                //url:"http://39.106.56.132:8080/userinfo/tologin",
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
                // console.log(data);
                if(data.status===true){
                    message.success("请求发送成功！");
                    this.setState({
                        pwd_code:data.data,
                        disabled_getCode:true,
                        codeTime:60,
                    },this.codeTime);

                }else if(!data.status){
                    message.error("The phone number is incorrect!");
                }
            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            });

        }
    }
    //修改手机号
    changePhone = () =>{

    const phone=this.state.newPhone;//this.state.username;
    const url=golbal.localhostUrl+"recordPhone?phone="+phone;
    // const url="http://39.106.56.132:8080/recordPhone?phone="+phone;
        fetch(url, {
            method: "POST",
            //type:"post",
            //url:"http://39.106.56.132:8080/userinfo/tologin",
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
            // console.log(data);
            if(data.status===true){
                message.success("手机号修改成功！");
                this.setState({
                    phone:this.state.newPhone
                },this.codeTime);
            }else if(!data.status){
                message.error("手机号修改失败！");
            }

        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });


    }
    /////////////////////////////////////////////////主函数/////////////////////////////////////////////////
    render() {

        return (
            <div >
                {/*<Button onClick={this.getUserInfo}>get</Button>*/}
                <Row style={{marginTop:10,borderRadius:10}}>
                    <Col span={18} offset={3} >
                        <Card
                            title={<h1 style={{float:'left',marginBottom:-10}}>Personal Information</h1>}
                            extra={
                                <div style={{width:230}} >
                                    <Row>
                                        <Col span={12}>
                                            <ChangePassword />

                                        </Col>
                                        <Col span={12}>
                                            <Button href="#" type={"primary"} onClick={this.updateResume} >Save</Button>

                                        </Col>
                                    </Row>
                                </div>
                            }
                            // style={{ width: 300 }}
                        >
                            <h3 style={{float:'left',marginTop:10}}>Name</h3>
                            <Input placeholder='Name' value={this.state.name} onChange={this.nameChange} disabled />
                            <h3 style={{float:'left',marginTop:10}}>Department</h3>
                            <Input placeholder='Department' value={this.state.departName} onChange={this.departNameChange} disabled/>
                            <h3 style={{float:'left',marginTop:10}}>Job</h3>
                            <Input placeholder='Job' value={this.state.positionName} onChange={this.positionNameChange} disabled/>
                            <h3 style={{float:'left',marginTop:10}}>Job Number</h3>
                            <Input placeholder='Job Number' value={this.state.worknum} onChange={this.workNumChange} disabled/>
                            <h3 style={{float:'left',marginTop:10}}>Phone</h3>
                            <div style={{float:'left',width:"100%"}}></div>
                            <Input style={{float:'left', width:"70%" }} placeholder='Phone'value={this.state.phone} onChange={this.phoneChange} disabled />
                            <Button style={{float:'left',marginLeft:"5%",width:"25%"}} type="primary" onClick={this.showModal}>Edit</Button>
                            <div style={{float:'left',width:"100%"}}></div>
                            <h3 style={{float:'left',marginTop:10}}>Introduction</h3><Input.TextArea rows={4}  placeholder='Introduction' value={this.state.resume} onChange={this.resumeChange}/>
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="Edit Phone"
                    visible={this.state.visible}
                    onOk={this.compareCode}
                    onCancel={this.handleCancel}
                    okType={"primary"}
                    okText={"Edit"}
                    cancelText={"Return"}
                >

                <Input style={{marginTop:10,borderRadius:5}} placeholder='Phone' onKeyUp={this.newPhoneChange}></Input>
                <Input style={{marginTop:10,borderRadius:5,width:"60%"}} placeholder='Enter confirmation code' onKeyUp={this.phoneCodeChange}></Input>
                <Button
                    style={{marginTop:10,borderRadius:5,marginLeft:"2%",width:"36%"}}
                    type='default' disabled={this.state.disabled_getCode}
                    onClick={this.getPhoneCode}
                >
                    {this.state.codeTime>0?"Please"+this.state.codeTime+"try again in seconds":"Get verification code"}
                </Button>
                </Modal>




            </div>
        );
    }
}


export default UserInfo;
