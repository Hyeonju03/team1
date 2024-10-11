package kr.or.nextit.team1.Controller;

import kr.or.nextit.team1.DTO.SignUpDTO;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // React 앱의 URL을 지정
public class Hello {

    // POST 요청 처리
    @PostMapping("/api/SignUp")
    public ResponseEntity<String> signUp(@RequestBody SignUpDTO signUpDTO) {
        // Service 호출하여 데이터 저장
        System.out.println(signUpDTO.getCompanyCode());
        System.out.println(signUpDTO.getId());
        System.out.println(signUpDTO.getName());
        return ResponseEntity.ok("회원가입 성공");
    }

    // GET 요청 처리 (예시로 남겨둘 수 있지만, 필요없다면 삭제 가능)
    @GetMapping("/api/SignUp")
    public ResponseEntity<Map<String, String>> getSignUpData() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "가입 성공??????!");
        return ResponseEntity.ok(response);
    }
}