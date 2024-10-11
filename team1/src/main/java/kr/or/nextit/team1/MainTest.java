package kr.or.nextit.team1;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class MainTest {

    private final TestService testService;

    public MainTest(TestService testService) {
        this.testService = testService;
    }
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok(testService.test());
    }
}
