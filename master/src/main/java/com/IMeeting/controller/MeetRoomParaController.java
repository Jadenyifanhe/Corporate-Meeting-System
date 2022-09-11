package com.IMeeting.controller;

import com.IMeeting.entity.MeetroomParameter;
import com.IMeeting.entity.ServerResult;
import com.IMeeting.resposirity.MeetroomParameterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/MeetRoomPara")
public class MeetRoomParaController {
    @Autowired
    private MeetroomParameterRepository meetroomParameterRepository;
    //跳转到会议设置参数界面
    @RequestMapping("/toMeetRoomPara")
    public ServerResult toMeetRoomPara(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        MeetroomParameter meetroomParameter = meetroomParameterRepository.findByTenantId(tenantId);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(meetroomParameter);
        serverResult.setStatus(true);
        return serverResult;
    }
    //修改租户会议参数设置，除了租户id(tenant_id其他参数都需要)
    @RequestMapping("/updateMeetRoomPara")
    public ServerResult updateMeetRoomPara(@RequestBody MeetroomParameter meetroomParameter) {
        meetroomParameterRepository.updateMMeetroomPara(meetroomParameter.getId(),meetroomParameter.getBegin(),meetroomParameter.getDateLimit(),meetroomParameter.getOver(),meetroomParameter.getTimeInterval(),meetroomParameter.getTimeLimit());
        ServerResult serverResult=new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }
    //恢复出厂设置
    @RequestMapping("/resetMeetRoomPara")
    public ServerResult resetMeetRoomPara(@RequestParam("id")Integer id) {
        meetroomParameterRepository.updateMMeetroomPara(id,"08:00",7,"18:00",15,120);
        ServerResult serverResult=new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }
}
