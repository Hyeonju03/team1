package kr.or.nextit.team1;

import org.springframework.web.bind.annotation.*;

@RestController
public class MainTest {

    @GetMapping("/api/mainTest")
    public String test() {
        System.out.println("test");
        return "sdgsdgsdgg";
    }
}
