package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.LogDTO;
import kr.or.nextit.team1.Services.LogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogController {

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }
    @GetMapping("/selectLog")
    public ResponseEntity<LogDTO> selectLog() {
        return ResponseEntity.ok(logService.selectLog());
    }
    @GetMapping("/selectIsLog")
    public ResponseEntity<LogDTO> selectIsLog(String comCode) {
        return ResponseEntity.ok(logService.selectIsLog(comCode));
    }
    @PostMapping("/logUpdate")
    public ResponseEntity<Void> logUpdate(@RequestBody LogDTO logDTO) {
        logService.logUpdate(logDTO);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/logInsert")
    public ResponseEntity<Void> logInsert(@RequestBody LogDTO logDTO) {
        logService.logInsert(logDTO);
        return ResponseEntity.ok().build();
    }
}
