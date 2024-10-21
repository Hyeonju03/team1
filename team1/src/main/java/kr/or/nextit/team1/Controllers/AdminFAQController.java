package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.AdminFAQDTO;
import kr.or.nextit.team1.Services.AdminFAQService;
import kr.or.nextit.team1.mappers.AdminFAQMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("/api/AdminFAQ")
public class AdminFAQController {

   private final AdminFAQMapper adminFAQMapper;

    @Autowired
    public AdminFAQController(AdminFAQMapper adminFAQMapper) {
        this.adminFAQMapper = adminFAQMapper;
    }

    @GetMapping("/FAQList")
    public List<AdminFAQDTO> getAllFAQs() {
        return adminFAQMapper.selectFAQ();
    }

}
