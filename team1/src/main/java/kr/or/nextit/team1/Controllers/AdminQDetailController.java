package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.AdminQDetailDTO;
import kr.or.nextit.team1.Services.AdminQDeleteService;
import kr.or.nextit.team1.mappers.AdminQDetailMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AdminQDetailController {
    private final AdminQDetailMapper adminQDetailMapper;
    private final AdminQDeleteService adminQDeleteService;

    @Autowired
    public AdminQDetailController(AdminQDetailMapper adminQDetailMapper, AdminQDeleteService adminQDeleteService) {
        this.adminQDetailMapper = adminQDetailMapper;
        this.adminQDeleteService = adminQDeleteService;
    }

    @GetMapping("/QDetailList")
    public List<AdminQDetailDTO> getQDetailList(@RequestParam String empCode) {
        return adminQDetailMapper.selectAdminQDetail(empCode);
    }

    //전체 답변
    @GetMapping("/AnsQDetailList")
    public List<AdminQDetailDTO> AnsQDetailList() {
        return adminQDetailMapper.AnsQDetailList();
    }

    //답변완룡
    @GetMapping("/AnsQCompleteList")
    public List<AdminQDetailDTO> AnsQCompleteList() {
        return adminQDetailMapper.AnsQCompleteList();
    }

    //미답변
    @GetMapping("/noAnsList")
    public List<AdminQDetailDTO> noAnsList() {
        return adminQDetailMapper.noAnsList();
    }

    @DeleteMapping("/deleteAdminQDetail")
    public ResponseEntity<Void> deleteQDetails(@RequestBody List<Long> ids) {
        adminQDeleteService.deleteAdminQDetail(ids);
        return ResponseEntity.noContent().build();
    }
}
