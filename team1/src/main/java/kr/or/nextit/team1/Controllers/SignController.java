package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.SignDTO;
import kr.or.nextit.team1.Services.SignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
public class SignController {
    private final SignService service;

    @GetMapping("/sign")
    public String selectSigns(Model model) {
        List<SignDTO> sign = service.selectSigns();
        model.addAttribute("sign", sign);
        return "sign";
    }
}
