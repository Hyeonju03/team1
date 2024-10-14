package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.AdminFAQDTO;
import kr.or.nextit.team1.Services.AdminFAQService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/AdminFAQ")
public class AdminFAQController {

    @Autowired
    private AdminFAQService adminFAQService;

    @GetMapping
    public List<AdminFAQDTO> getAllFAQs() {
        return adminFAQService.getAllFAQs();
    }

    @PostMapping
    public void addFAQ(@RequestBody AdminFAQDTO faq) {
        adminFAQService.addFAQ(faq);
    }

}
