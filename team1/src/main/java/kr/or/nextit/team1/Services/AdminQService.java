package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.AdminInfoDTO;
import kr.or.nextit.team1.DTOs.AdminQDTO;
import kr.or.nextit.team1.mappers.AdminQMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminQService {
    private final AdminQMapper adminQMapper;

    public AdminQService(AdminQMapper adminQMapper) {
        this.adminQMapper = adminQMapper;
    }

    @Transactional
    public void registerQ(AdminQDTO adminQDTO) {
        try {
            adminQMapper.insertQ(adminQDTO);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public void updateAdminQ(AdminQDTO adminQDTO) {
        adminQMapper.updateAdminQ(adminQDTO);
    }

}
