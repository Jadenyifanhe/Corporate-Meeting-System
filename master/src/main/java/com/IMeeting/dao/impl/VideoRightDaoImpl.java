package com.IMeeting.dao.impl;

import com.IMeeting.dao.TaskDao;
import com.IMeeting.dao.VideoRightDao;
import com.IMeeting.entity.Task;
import com.IMeeting.entity.VideoRight;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;



@Transactional
@Repository
public class VideoRightDaoImpl extends BaseDaoImpl<VideoRight,Integer>implements VideoRightDao {
}
