package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.SignUpDTO;
import kr.or.nextit.team1.Services.SignUpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class SignUpController {
    private final SignUpService signUpService;

    public SignUpController(SignUpService signUpService) {
        this.signUpService = signUpService;
    }

    @PostMapping("/signUp")
    public ResponseEntity<String> signUp(@RequestBody SignUpDTO signUpDTO) {
        System.out.println("들어옴?");
        signUpService.registerUser(signUpDTO);
        return ResponseEntity.ok("User registered successfully!");
    }
}
