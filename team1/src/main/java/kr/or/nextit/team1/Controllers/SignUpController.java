package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.DTOs.SignUpDTO;
import kr.or.nextit.team1.Services.EmailService;
import kr.or.nextit.team1.Services.SignUpService;
import kr.or.nextit.team1.mappers.SignUpMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
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

    @GetMapping("/rankSignUp")
    public List<CodeDTO> getAllranks(@RequestParam String comCode) {
        return signUpMapper.getAllranks(comCode); // SignUpMapper의 메소드를 호출
    }

    @GetMapping("/selectCorcode")
    public List<SignUpDTO> selectCorcode(@RequestParam String comCode, String depCode) {
        return signUpMapper.selectCorcode(comCode, depCode);
    }

    @PostMapping("/findAllempCode")
    public int getAllAllempCodes(@RequestBody SignUpDTO signUpDTO) {
        System.out.println(signUpDTO);
        return signUpMapper.findAllempCode(signUpDTO);
    }

    private String RendomCode() {
        return String.valueOf((int) (Math.random() * 900000) + 100000); // 6자리 랜덤 숫자 생성
    }

    @PostMapping("/randomCode")
    public ResponseEntity<Map<String, String>> sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = RendomCode(); // 생성한 코드
        emailService.sendVerificationCode(email, code); // 이메일 전송

        Map<String, String> response = new HashMap<>();
        response.put("code", code);

        return ResponseEntity.ok(response);
    }


}