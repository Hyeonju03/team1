package kr.or.nextit.team1.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class Hello {
    @GetMapping("/api/hello")
    public String hello() {
        return "Hello World";
    }
}
