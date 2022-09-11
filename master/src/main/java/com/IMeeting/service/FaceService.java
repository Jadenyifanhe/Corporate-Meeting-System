package com.IMeeting.service;

import com.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;

public interface FaceService {
    ServerResult selectAll(HttpServletRequest request);
}
