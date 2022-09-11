package com.IMeeting.dao.impl;

import com.IMeeting.dao.BaseDao;
import com.IMeeting.dao.OpenApplyDao;
import com.IMeeting.entity.OpenApply;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Repository
public class OpenApplyDaoImpl extends BaseDaoImpl<OpenApply,Integer>implements OpenApplyDao{
}
