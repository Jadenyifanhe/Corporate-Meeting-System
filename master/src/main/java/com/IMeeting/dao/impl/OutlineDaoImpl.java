package com.IMeeting.dao.impl;

import com.IMeeting.dao.OpenApplyDao;
import com.IMeeting.dao.OutlineDao;
import com.IMeeting.entity.OpenApply;
import com.IMeeting.entity.Outline;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Repository
public class OutlineDaoImpl extends BaseDaoImpl<Outline,Integer>implements OutlineDao {
}
