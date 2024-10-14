package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.LogDTO;
import kr.or.nextit.team1.Services.LogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping("/logInsert")
    public ResponseEntity<LogDTO> logInsert(@RequestBody LogDTO logDTO) {
        return ResponseEntity.ok(logService.logInsert(logDTO));
    }


}
