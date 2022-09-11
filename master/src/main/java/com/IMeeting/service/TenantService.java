package com.IMeeting.service;

import com.IMeeting.entity.Tenant;

import java.util.Optional;


public interface TenantService {
    Optional<Tenant> findById(Integer tenantId);
}
