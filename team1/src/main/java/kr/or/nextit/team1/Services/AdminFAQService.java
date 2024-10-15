package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.AdminFAQDTO;
import kr.or.nextit.team1.mappers.AdminFAQMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminFAQService {

    private final AdminFAQMapper adminFAQMapper;

    public AdminFAQService(AdminFAQMapper adminFAQMapper) {
        this.adminFAQMapper = adminFAQMapper;
    }
}
