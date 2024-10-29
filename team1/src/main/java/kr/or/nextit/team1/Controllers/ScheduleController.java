package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.ScheduleDTO;
import kr.or.nextit.team1.Services.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

//@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleController {
    private final ScheduleService service;
    private final ScheduleService scheduleService;

    @GetMapping("/selectSchedule")
    public List<ScheduleDTO> selectSchedules(@RequestParam String empCode) {
        if (empCode == null || empCode.isEmpty()) {
            throw new IllegalArgumentException("empCode must not be null or empty");
        }
        return service.selectSchedules(empCode); // JSON 형태로 응답
    }

    @PostMapping("/scheduleInsert")
    public ResponseEntity<String> scheduleInsert(@RequestBody ScheduleDTO scheduleDTO) {
        scheduleService.scheduleInsert(scheduleDTO);
        return ResponseEntity.ok("들어감");
    }

    @PutMapping("/updateSchedule")
    public ResponseEntity<Void> updateSchedule(@RequestBody ScheduleDTO scheduleDTO) {
        scheduleService.updateSchedule(scheduleDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/deleteSchedule")
    public ResponseEntity<Void> deleteSchedule(@RequestParam String sNum) {
        scheduleService.deleteSchedule(sNum);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/selectAuth")
    public ResponseEntity<String> selectAuth(@RequestParam String empCode) {
        String result = scheduleService.selectAuth(empCode);
        return ResponseEntity.ok(result);
    }
}