import React, { Component } from 'react';
import {Button, Card, Col, DatePicker, Drawer, Input, Modal, Row, TimePicker,Form,Select} from "antd";
import golbal from '@/golbal';

const DoorCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line

    class extends Component {
        componentDidMount(){
            this.props.form.setFieldsValue({
                continuedTime: [],
                description: [],
                groups: [],
                guests: [],
                meetingRoom: [],
                others: [],
                prepareTime: [],
                title: [],
            })
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
            departId:"",
        };
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        render() {
            const {
                visible, onClose,onCreate, form,
            } = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: { span: 6 },
                wrapperCol: { span: 12 },
            };

            let weekList=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
            return (
                <Drawer
                    title={
                        <Button href="#" type={"primary"} onClick={onCreate}>添加权限</Button>
                    }
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                    width={"60%"}
                >
                    <Card>
                        <Form layout="vertical">
                            <Row>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout}
                                        label="Meeting Room"

                                    >
                                        {getFieldDecorator('meetRoomId',{
                                                rules: [{required: true, message: 'Please choose a meeting room!' }],
                                            }
                                        )(
                                            <Select  style={{ width: 120 }} onChange={()=>{}}>
                                                {this.props.roomList.map((item,i)=>{//roomList是后台数据列表
                                                    return(
                                                        <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Form.Item
                                        {...formItemLayout}
                                        label="用户"

                                    >
                                        <Row>
                                            <Col span={12}>
                                                <Select
                                                    style={{ width: 120 }}
                                                    onChange={(value)=>{
                                                        let userList=[];
                                                        this.props.userList[3].map((item)=>{
                                                            if(item.departId===value){
                                                                userList.push(item)
                                                            }
                                                        })
                                                        this.setState({
                                                            userList:userList
                                                        })
                                                    }}
                                                >
                                                    {this.props.userList[0].map((item,i)=>{//roomList是后台数据列表
                                                        return(
                                                            <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                                        )
                                                    })}

                                                </Select>
                                            </Col>
                                            <Col span={12}>
                                                {getFieldDecorator('userId',{
                                                        rules: [{required: true, message: '请选择用户！' }],
                                                    }
                                                )(
                                                    <Select  style={{ width: 120 }} onChange={()=>{}}>
                                                        {this.state.userList.map((item,i)=>{//roomList是后台数据列表
                                                            return(
                                                                <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                                            )
                                                        })}

                                                    </Select>
                                                )}
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Start Date"
                                    >
                                        {getFieldDecorator('beginDate', {
                                            rules: [{ type: 'object', required: true, message: 'Please enter a date!' }],
                                        })(
                                            <DatePicker
                                                placeholder="Select Date"
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="End Date"
                                    >
                                        {getFieldDecorator('overDate', {
                                            rules: [{ type: 'object', required: true, message: 'Please enter a date!' }],
                                        })(
                                            <DatePicker
                                                placeholder="Select Date"
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Daily Start Time"
                                    >
                                        {getFieldDecorator('beginTime', {
                                            rules: [{ type: 'object', required: true, message: 'Please enter a start time!' }],
                                        })(
                                            <TimePicker
                                                placeholder="Select Time"
                                                minuteStep={15}
                                                format={'HH:mm'}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="Daily End Time"
                                    >
                                        {getFieldDecorator('overTime', {
                                            rules: [{ type: 'object', required: true, message: 'Please enter an end time!' }],
                                        })(
                                            <TimePicker
                                                placeholder="Select Time"
                                                minuteStep={15}
                                                format={'HH:mm'}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                {...formItemLayout}
                                label="Illustrate"
                            >
                                {getFieldDecorator('note',
                                    {
                                        rules: [{ required: true, message: '请说明原因！' }],
                                    }
                                )(
                                    <Input.TextArea
                                        rows={5}
                                    >
                                    </Input.TextArea>
                                )}
                            </Form.Item>
                        </Form>
                    </Card>
                </Drawer>
            );
        }
    }
);
export default DoorCreateForm;
