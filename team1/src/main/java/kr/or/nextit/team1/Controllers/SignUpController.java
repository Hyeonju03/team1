package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.DTOs.SignUpDTO;
import kr.or.nextit.team1.Services.EmailService;
import kr.or.nextit.team1.Services.SignUpService;
import kr.or.nextit.team1.mappers.SignUpMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class SignUpController {

    private final SignUpService signUpService;
    private final SignUpMapper signUpMapper;
    private final EmailService emailService;

    @Autowired
    public SignUpController(SignUpService signUpService, SignUpMapper signUpMapper, EmailService emailService) {
        this.signUpService = signUpService;
        this.signUpMapper = signUpMapper; // Mapper를 초기화
        this.emailService = emailService;
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

    @GetMapping("/findAllempCode")
    public List<SignUpDTO> getAllAllempCodes(@RequestParam String comCode) {

        return signUpMapper.findAllempCode(comCode);
    }

    private String RendomCode() {
        return String.valueOf((int) (Math.random() * 900000) + 100000); // 6자리 랜덤 숫자 생성
    }

    @PostMapping("/randomCode")
    public ResponseEntity<Map<String, String>> sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = RendomCode(); // 생성한 코드
        emailService.sendVerificationCode(email, code); // 이메일 전송

        // Java 8을 사용할 경우 Map을 수동으로 생성
        Map<String, String> response = new HashMap<>();
        response.put("code", code);

        return ResponseEntity.ok(response);
    }
}