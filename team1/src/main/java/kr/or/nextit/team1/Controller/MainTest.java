package kr.or.nextit.team1.Controller;

import kr.or.nextit.team1.Service.TestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
