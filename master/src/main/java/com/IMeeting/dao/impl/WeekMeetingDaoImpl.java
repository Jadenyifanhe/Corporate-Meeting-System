package com.IMeeting.dao.impl;

import com.IMeeting.dao.WeekMeetingDao;
import com.IMeeting.entity.WeekMeeting;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Repository
public class WeekMeetingDaoImpl extends BaseDaoImpl<WeekMeeting,Integer>implements WeekMeetingDao {
}
