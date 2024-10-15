package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.AdminQDTO;
import kr.or.nextit.team1.Services.AdminQService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AdminQController {

    private final AdminQService adminQService;

    @Autowired
    public AdminQController(AdminQService adminQService) {
        this.adminQService = adminQService;
    }

    @PostMapping("/insertQ")
    public ResponseEntity<String> insertQ(@RequestBody AdminQDTO adminQDTO) {
        adminQService.registerQ(adminQDTO);
        return ResponseEntity.ok("들어감");
    }
}
