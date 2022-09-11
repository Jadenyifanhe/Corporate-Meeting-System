package com.IMeeting.service;

import com.IMeeting.entity.Group;
import com.IMeeting.entity.ServerResult;
import com.IMeeting.entity.Userinfo;

import javax.servlet.http.HttpServletRequest;
import java.util.List;


public interface GroupService {
    ServerResult deleteGroup(Integer id);
    Group selectGroup(Integer id);
    ServerResult showOneGroup(Integer id);
    ServerResult updateOneGroup(Integer id,List<Integer> userIds,String name);
    ServerResult getGroupList(Integer userId);
    ServerResult showUser(HttpServletRequest request);
}
