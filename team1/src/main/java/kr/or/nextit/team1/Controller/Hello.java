package kr.or.nextit.team1.Controller;

import kr.or.nextit.team1.DTO.SignUpDTO;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
public class Hello {

    // POST 요청 처리
    @PostMapping("/api/SignUp")
    public String signUp(@RequestBody SignUpDTO signUpDTO) {
        // Service 호출하여 데이터 저장
        System.out.println("signUp");
        System.out.println(signUpDTO);
        return "회원가입 성공";
    }


}