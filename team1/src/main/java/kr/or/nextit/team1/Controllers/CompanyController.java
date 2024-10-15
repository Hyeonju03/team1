package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.CompanyDTO;
import kr.or.nextit.team1.Services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class CompanyController {
    private final CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> insertCompany(@RequestBody CompanyDTO companyDTO) {
        Map<String, String> response = new HashMap<>();
        try {
            companyService.insertCompany(companyDTO);
            response.put("message", "사용 등록 완료");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "사용 등록 실패");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
