package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import kr.or.nextit.team1.Services.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CodeController {

    @Autowired
    private CodeService codeService;

    @GetMapping("/code")
    public List<CodeDTO> selectCategories() {
        return codeService.selectCategories(); // 모든 카테고리 반환
    }


}
