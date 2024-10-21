package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.mappers.AdminQDetailMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminQDeleteService {
    private final AdminQDetailMapper adminQDetailMapper;

    @Autowired
    public AdminQDeleteService(AdminQDetailMapper adminQDetailMapper) {
        this.adminQDetailMapper = adminQDetailMapper;
    }

    public void deleteAdminQDetail(List<Long> ids) {
        for (Long id : ids) {
            adminQDetailMapper.deleteAdminQDetail(id);
        }
    }

}
