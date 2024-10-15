package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.ScheduleDTO;
import kr.or.nextit.team1.Services.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService service;

    @GetMapping("/schedule")
    public String selectSchedules(Model model) {
        List<ScheduleDTO> schedule = service.selectSchedules();
        model.addAttribute("schedule", schedule);
        return "schedule";
    }

//    @GetMapping("/schedule/detail")
//    public String selectSchedule(@RequestParam(value = "id", defaultValue = "0") int id, Model model) {
//        ScheduleDTO schedule = service.selectSchedule(id);
//        model.addAttribute("schedule", schedule);
//        return "schedule/detail";
//    }
//
//    @GetMapping("/schedule/register")
//    public String registerSchedule() {
//        return "schedule/register";
//    }
//
//    @PostMapping("/schedule/register")
//    public String registerSchedule(@ModelAttribute ScheduleDTO schedule, MultipartFile files) throws IOException {
//        service.registerSchedule(schedule);
//        return "redirect:/schedule";
//    }
//
//    @GetMapping("/schedule/modify")
//    public String modifySchedule(@RequestParam(value = "id", defaultValue = "0") int id, Model model) {
//        ScheduleDTO schedule = service.selectSchedule(id);
//        model.addAttribute("schedule", schedule);
//        return "schedule/modify";
//    }
//
//    @PostMapping("/schedule/modify")
//    public String modifySchedule(@ModelAttribute ScheduleDTO schedule) {
//        service.modifySchedule(schedule);
//        return "redirect:/schedule/detail?id=" + schedule.getId();
//    }
//
//    @GetMapping("/schedule/remove")
//    public String removeSchedule(int id) {
//        service.removeSchedule(id);
//        return "redirect:/schedule";
//    }

}