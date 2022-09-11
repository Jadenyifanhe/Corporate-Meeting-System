package com.IMeeting.dao.impl;

import com.IMeeting.dao.FaceDao;
import com.IMeeting.entity.FaceInfo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Repository
public class FaceDaoImpl extends BaseDaoImpl<FaceInfo,Integer>implements FaceDao {
}
