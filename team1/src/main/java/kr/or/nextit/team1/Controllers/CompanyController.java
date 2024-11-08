package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.CompanyDTO;
import kr.or.nextit.team1.Services.CompanyService;
import kr.or.nextit.team1.mappers.CompanyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CompanyController {
    private final CompanyService companyService;
    private final CompanyMapper companyMapper;

    @Autowired
    public CompanyController(CompanyService companyService, CompanyMapper companyMapper) {
        this.companyService = companyService;
        this.companyMapper = companyMapper;
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

    @GetMapping("/selectComList")
    public List<CompanyDTO> selectComList(@RequestParam String comCode) {
        return companyService.selectComList(comCode);
    }

    @GetMapping("/selectAllEmpNum")
    public int selectAllEmpNum(@RequestParam String comCode) {
        return companyService.selectAllEmpNum(comCode);
    }

    @PutMapping("/updateInfo")
    public ResponseEntity<Void> updateInfo(@RequestBody List<CompanyDTO> companyDTOs) {
        for (CompanyDTO companyDTO : companyDTOs) {
            companyService.updateInfo(companyDTO);
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<Void> updateStatus(@RequestParam String comCode) {
        companyService.updateStatus(comCode);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/selectStatus")
    public int selectStatus(@RequestParam String comCode) {
        return companyService.selectStatus(comCode);
    }

    @GetMapping("/selectCompanyEdit")
    public int selectCompanyEdit(@RequestParam String empCode) {
        return companyMapper.selectCompanyEdit(empCode);
    }
}
