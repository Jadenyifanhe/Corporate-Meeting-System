import React, { Component } from 'react';
import logo from "@/img/logo/logo1024.png";
import {Button, Icon, Input, message,Drawer} from "antd";
import {Link} from "react-router-dom";
class Head extends Component {

    constructor(props, context) {
        super(props, context);
        
        this.state = {
            username: "",
            password: "",
            visible: false,
            name:"Login",
            loading: false,
        }
    }
    //弹出登录框
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    }
    //关闭登录框
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    //修改用户名显示
    nameChange=(e)=>{
        this.setState({ name : e })
    }
    //username被修改
    usernameChange=(e)=>{
        this.setState({ username : e.target.value })
    }
    //password被修改
    passwordChange=(e)=>{
        this.setState({ password : e.target.value })
    }
    //登录
    enterLoading = () => {
        this.setState({ loading: true });
        this.sendAjax();
        this.overLoading();
        this.onClose();

    }
    //点击登录后旋转2秒
    overLoading = () => {
        setInterval(() => {this.setState({ loading: false })}, 2000);
    }
    //发送登录请求
    sendAjax = () =>{
        //POST方式,IP为本机IP
        const username=this.state.username;//this.state.username;
        const password=this.state.password;//this.state.password;
        if(username===""||password===""){
            message.warning("Username or password cannot be empty！");
        }else{
            fetch("http://39.106.56.132:8080/userinfo/tologin", {

                method: "POST",
                //type:"post",
                //url:"http://39.106.56.132:8080/userinfo/tologin",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({username:username,password:password}),
            }).then(function (res) {//function (res) {} 和 res => {}效果一致
                return res.json()
            }).then(json => {
                // get result
                const data = json;
                console.log(data);
                if(data.message==="登录成功"){
                    this.nameChange(data.data.name);
                    message.success(data.message);
                    this.onClose();
                }else if(data.message==="账号密码有误"){
                    message.error("wrong user name or password！");
                }else {
                    message.error("unknown mistake");
                }

            }).catch(function (e) {
                console.log("fetch fail");
                alert('system error');
            });

        }

    }
    //主函数
    render() {
        return (
            <div className={'head'}>
                {/*right*/}
                {/*<div>{this.props.name}</div>*/}
                <img src={logo} className="App-logo logo" alt="logo" />
                <span className={'companyName'}><h2><Link to='/welcome'>Home Page</Link></h2></span>
                {/*left*/}
                {/*<Input className={'searchText'} suffix={(*/}
                    {/*<Button className="search-btn"  type="primary">*/}
                        {/*<Icon type="search" />*/}
                    {/*</Button>*/}
                {/*)}*/}
                {/*/>*/}
                <Button className={'headBtn1'} type="primary" onClick={this.showDrawer}>{this.state.name}</Button>
                <Button className={'headBtn1'} type='primary' ><Icon type="ellipsis" /></Button>
                <Input className={'searchText'} suffix={<Icon type="search"  />} />

                <Drawer title="User Login" placement="right" onClose={this.onClose} visible={this.state.visible}>
                    <p>User Name</p>
                    <Input type='' placeholder='username' onKeyUp={this.usernameChange}></Input>
                    <br/>
                    <br/>
                    <p>Password</p>
                    <Input type='password' placeholder='password' onKeyUp={this.passwordChange}></Input>
                    <Button className={'headBtn1'} type='default' onClick={this.onClose}>Forgot Password</Button>
                    <Button className={'headBtn2'} type='primary' loading={this.state.loading} onClick={this.enterLoading} >Login</Button>
                    <Button className={'headBtn3'} type='default' onClick={this.sendAjax}>Don't have an account yet? Click to register</Button>
                </Drawer>

            </div>
        );
    }
}

export default Head;
