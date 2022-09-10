import React, { Component } from 'react';
import {Button, Input, Modal,message,Row,Col} from "antd";
import golbal from '@/golbal';
class ChangePassword extends Component {
    state = {
        visible: false,
        oldPassword:"",
        newPassword:"",
        newConfig:"",
    }

    showModal = () => {
        this.setState({
            visible: true,
            oldPassword:"",
            newPassword:"",
            newConfig:"",
        });
    }

    handleOk = (e) => {
        console.log(e);
        if(this.state.oldPassword===""){
            message.error("旧密码不能为空！");
        }else
        if(this.state.newPassword===""){
            message.error("新密码不能为空！");
        }else
        if(this.state.newConfig===this.state.newPassword){
            this.changePassword();
        }else{
            message.error("新密码校验不一致！")
        }
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    oldPasswordChange=(e)=>{
        this.setState({
            oldPassword: e.target.value,
        });
    }

    newPasswordChange=(e)=>{
        this.setState({
            newPassword: e.target.value,
        });
    }

    newConfigChange=(e)=>{
        this.setState({
            newConfig: e.target.value,
        });
    }
    ///////////////////////////////////////////////////////////////////////////
    //changePassword
    changePassword = () =>{
        const url=golbal.localhostUrl+"changePwd?newPassword="+this.state.newPassword+"&oldPassword="+this.state.oldPassword;
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
                this.setState({
                    visible: false,
                });
                message.success("密码修改成功！");
            }else{
                message.error(data.message);
            }

        }).catch(function (e) {
            console.log("fetch fail");
            alert('system error');
        });
    }

    render() {
        return (
            <div style={this.props.style}>
                <Button type="primary" onClick={this.showModal}>Edit Password</Button>
                <Modal
                    title="Edit Password"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okType={"primary"}
                    okText={"Edit"}
                    cancelText={"Return"}
                >
                    <Row >
                        <Col span={24}>
                            <Input.Password  style={{marginTop:10}} value={this.state.oldPassword} placeholder='Enter old password' onChange={this.oldPasswordChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Input.Password style={{marginTop:10}} value={this.state.newPassword} placeholder='Enter new password' onChange={this.newPasswordChange}/>

                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Input.Password style={{marginTop:10}} value={this.state.newConfig} placeholder='Enter new password again' onChange={this.newConfigChange}/>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}
export default ChangePassword;
