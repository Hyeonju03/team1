package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.AdminInfoDTO;
import kr.or.nextit.team1.DTOs.AdminQDTO;
import kr.or.nextit.team1.Services.AdminQService;
import kr.or.nextit.team1.mappers.AdminQMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AdminQController {

    private final AdminQService adminQService;
    private final AdminQMapper adminQMapper;

    @Autowired
    public AdminQController(AdminQService adminQService, AdminQMapper adminQMapper) {
        this.adminQService = adminQService;
        this.adminQMapper = adminQMapper;
    }

    @PostMapping("/insertQ")
    public ResponseEntity<String> insertQ(@RequestBody AdminQDTO adminQDTO) {
        adminQService.registerQ(adminQDTO);
        return ResponseEntity.ok("들어감");
    }

    @GetMapping("/selectEmpCode")
    public String selectEmpCode(@RequestParam("empCode") String empCode) {
        return adminQMapper.findEmpCode(empCode);
    }

    //이밑부턴 admin
    @PutMapping("/updateAdminQ")
    public ResponseEntity<Void> updateAdminQ(@RequestBody AdminQDTO adminQDTO) {
        adminQService.updateAdminQ(adminQDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/selectAdmin")
    public int selectAdmin(@RequestParam String adminId) {
        return adminQMapper.selectAdmin(adminId);
    }
}
