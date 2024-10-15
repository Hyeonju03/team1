package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.DTOs.SignUpDTO;
import kr.or.nextit.team1.Services.SignUpService;
import kr.or.nextit.team1.mappers.SignUpMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class SignUpController {

    private final SignUpService signUpService;
    private final SignUpMapper signUpMapper;

    @Autowired
    public SignUpController(SignUpService signUpService, SignUpMapper signUpMapper) {
        this.signUpService = signUpService;
        this.signUpMapper = signUpMapper; // Mapper를 초기화
    }

    @PostMapping("/signUp")
    public ResponseEntity<String> signUp(@RequestBody SignUpDTO signUpDTO) {
        System.out.println("들어옴?");
        signUpService.registerUser(signUpDTO);
        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/codeSignUp")
    public List<CodeDTO> getAllCodes(@RequestParam String comCode) {
        return signUpMapper.findAllCodes(comCode); // SignUpMapper의 메소드를 호출
    }
}
