package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.ListLibraryDTO;
import kr.or.nextit.team1.Services.ListLibraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    @GetMapping("/RClickWindowSelect")
    public ResponseEntity<String[]> RClickWindowSelect(String code) {
        ListLibraryDTO data = listLibraryService.RClickWindowSelect(code);
        String[] splitData = new String[2];
        splitData[0] = data.getMail();
        splitData[1] = data.getPH();
        return ResponseEntity.ok(splitData);
    }

    @PostMapping("/noticeInsert")
    public ResponseEntity<Void> noticeInsert(@RequestBody ListLibraryDTO dto) {
        listLibraryService.noticeInsert(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/noticeListSelect1")
    public ResponseEntity<List<String>[]> noticeListSelect1(String code) {
        List<ListLibraryDTO> data = listLibraryService.noticeListSelect1(code);
        List<String>[] list = new ArrayList[6];
        System.out.println(data);
        for (int i = 0; i < list.length; i++) {
            list[i] = new ArrayList<>();
        }
        for (int i = 0; i < data.size(); i++) {
            list[0].add(data.get(i).getNoticeNum());
            list[1].add(data.get(i).getTitle());
            list[2].add(data.get(i).getContent());
            list[3].add(String.valueOf(data.get(i).getStartDate()));
            list[4].add(data.get(i).getTargetState());
            list[5].add(String.valueOf(data.get(i).getEndDate()));
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/noticeListSelect2")
    public ResponseEntity<List<List<String>>> noticeListSelect2(String code) {
        List<ListLibraryDTO> data = listLibraryService.noticeListSelect2(code);
        List<List<String>> list = new ArrayList<>();

        for (int i = 0; i < data.size(); i++) {
            List<String> innerList = new ArrayList<>();
            String[] splitData = data.get(i).getTargets().split(",");
            for (String target : splitData) {
                if (target != null && target.length() > 2) {
                    innerList.add(target.substring(0, target.length() - 2));
                }
            }
            list.add(innerList);  // 이 부분 수정
        }
        return ResponseEntity.ok(list);
    }
}
