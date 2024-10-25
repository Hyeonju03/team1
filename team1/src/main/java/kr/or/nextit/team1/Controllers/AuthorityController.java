package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.AuthorityDTO;
import kr.or.nextit.team1.Services.AuthorityService;
import kr.or.nextit.team1.mappers.AuthorityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthorityController {

    private final AuthorityService authorityService;
    private final AuthorityMapper authorityMapper;

    @Autowired
    public AuthorityController(AuthorityService authorityService, AuthorityMapper authorityMapper) {
        this.authorityService = authorityService;
        this.authorityMapper = authorityMapper;
    }

    @GetMapping("/permissionSelect")
    public int permissionSelect(@RequestParam String empCode) {
        return authorityMapper.permissionSelect(empCode);
    }

    @GetMapping("/selectEmployeeList")
    public List<AuthorityDTO> selectEmployeeList(@RequestParam String empCode) {
        return authorityMapper.selectEmployeeList(empCode);
    }

    @PostMapping("/insertAuth")
    public ResponseEntity<String> insertAuth(@RequestBody AuthorityDTO authorityDTO) {
        authorityService.insertAuth(authorityDTO);
        return ResponseEntity.ok("들어감");
    }

    @GetMapping("/selectAllAuth")
    public List<AuthorityDTO> selectEmpCode(@RequestParam String empCode) {
        return authorityMapper.selectAllAuth(empCode);
    }

    @PutMapping("/updateAuth")
    public ResponseEntity<Void> updateAuth(@RequestBody AuthorityDTO authorityDTO) {
        authorityService.updateAuth(authorityDTO);
        return ResponseEntity.ok().build();
    }
}
