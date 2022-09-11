package com.IMeeting.service.serviceImpl;

import com.IMeeting.entity.Tenant;
import com.IMeeting.resposirity.TenantRepository;
import com.IMeeting.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TenantServiceImpl implements TenantService {
    @Autowired
    private TenantRepository tenantRepository;

    @Override
    public Optional<Tenant> findById(Integer tenantId) {
        return tenantRepository.findById(tenantId);
    }
}
