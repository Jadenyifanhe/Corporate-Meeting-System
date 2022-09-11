package com.IMeeting.dao.impl;

import com.IMeeting.dao.MeetingVideoDao;
import com.IMeeting.dao.VideoRightDao;
import com.IMeeting.entity.MeetingVideo;
import com.IMeeting.entity.VideoRight;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Repository
public class MeetingVideoDaoImpl extends BaseDaoImpl<MeetingVideo,Integer>implements MeetingVideoDao {
}
