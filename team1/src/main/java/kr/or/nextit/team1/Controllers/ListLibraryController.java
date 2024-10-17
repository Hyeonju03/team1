package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.ListLibraryDTO;
import kr.or.nextit.team1.Services.ListLibraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ListLibraryController {
    private final ListLibraryService listLibraryService;

    public ListLibraryController(ListLibraryService listLibraryService) {
        this.listLibraryService = listLibraryService;
    }

    @GetMapping("/chartSelect")
    public ResponseEntity<List<String>[]> chartSelect(String code) {
        List<ListLibraryDTO> data = listLibraryService.chartSelect(code);
        List<String>[] list = new ArrayList[5];
        for (int i = 0; i < list.length; i++) {
            list[i] = new ArrayList<>();
        }
        String[] splitData1 = data.get(0).getDepCode().split(",");
        String[] splitData2 = data.get(0).getUpDepCode().split(",");
        for (int i = 0; i < splitData1.length; i++) {
            list[0].add(splitData1[i]);
            list[1].add(splitData2[i]);
        }
        for (int i = 0; i < data.size(); i++) {
            list[2].add(data.get(i).getEmpCode());
            list[3].add(data.get(i).getEmpName());
            list[4].add(data.get(i).getEmpDepCode());
        }
        return ResponseEntity.ok(list);
    }
}
