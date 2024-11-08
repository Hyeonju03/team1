package kr.or.nextit.team1.Controllers;

import kr.or.nextit.team1.DTOs.ListLibraryDTO;
import kr.or.nextit.team1.Services.ListLibraryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/loadNoticeSelect")
    public ResponseEntity<List<String>[]> loadNoticeSelect(String code) {
        List<ListLibraryDTO> data = listLibraryService.loadNoticeSelect(code);
        List<String>[] list = new ArrayList[5];
        for (int i = 0; i < list.length; i++) {
            list[i] = new ArrayList<>();
        }
        for (int i = 0; i < data.size(); i++) {
            list[0].add(data.get(i).getTitle());
            list[1].add(String.valueOf(data.get(i).getStartDate()));
            list[2].add(String.valueOf(data.get(i).getEndDate()));
            list[3].add(data.get(i).getContent());
            list[4].add(data.get(i).getTargets());
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/noticeUpdate")
    public ResponseEntity<Void> noticeUpdate(@RequestBody Map<String, Object> data) {
        listLibraryService.noticeUpdate(data);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/addressBookSelect")
    public ResponseEntity<List<String>[]> addressBookSelect(String code, String keyWord) {
        List<ListLibraryDTO> data = listLibraryService.addressBookSelect(code);
        List<String>[] list = new ArrayList[5];
        for (int i = 0; i < list.length; i++) {
            list[i] = new ArrayList<>();
        }
        for (int i = 0; i < data.size(); i++) {
            if (keyWord == null ||data.get(i).getDepCode().contains(keyWord)||data.get(i).getEmpName().contains(keyWord)||data.get(i).getPosCode().contains(keyWord)||data.get(i).getPH().contains(keyWord)||data.get(i).getMail().contains(keyWord)){
                list[0].add(data.get(i).getDepCode());
                list[1].add(data.get(i).getEmpName());
                list[2].add(data.get(i).getPosCode());
                list[3].add(data.get(i).getPH());
                list[4].add(data.get(i).getMail());
            }
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/addressBookListSelect")
    public ResponseEntity<List<String>[]> addressBookListSelect(String code) {
        List<ListLibraryDTO> data = listLibraryService.addressBookListSelect(code);
        List<String>[] list = new ArrayList[1];
        for (int i = 0; i < list.length; i++) {
            list[i] = new ArrayList<>();
        }
        String[] splitData = data.get(0).getEmpAdd().split(",");
        for (int i = 0; i < splitData.length; i++) {
            list[0].add(splitData[i]);
        }
        return ResponseEntity.ok(list);
    }

    @PostMapping("/addressBookAdd")
    public ResponseEntity<Void> addressBookAdd(@RequestBody Map<String, Object> data) {
        listLibraryService.addressBookAdd(data);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/addressBookDelete")
    public ResponseEntity<Void> addressBookDelete(@RequestBody Map<String, Object> data) {
        listLibraryService.addressBookDelete(data);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/chatInSelect1")
    public ResponseEntity<List<List<String>>[]> chatInSelect1(String chatNum) {
        List<ListLibraryDTO> data = listLibraryService.chatInSelect1(chatNum);
        List<List<String>>[] list = new ArrayList[4];
        for (int i = 0; i < list.length; i++) {
            list[i] = new ArrayList<>();
        }
        String[] splitData1 =  data.get(0).getContent().split(",");
        for (int i = 0; i < splitData1.length; i++) {
            String splitData3 = splitData1[i].substring(0,splitData1[i].indexOf(':'));
            String[] splitData4 = splitData1[i].substring(splitData1[i].indexOf(':')+1).split("_");
            list[0].add(List.of(splitData3));
            list[1].add(List.of(splitData4[0]));
            list[2].add(List.of(splitData4[1]));
            list[3].add(List.of(Arrays.copyOfRange(splitData4, 2, splitData4.length)));
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/chatInSelect2")
    public ResponseEntity<String[]> chatInSelect2(String chatNum) {
        List<ListLibraryDTO> data = listLibraryService.chatInSelect2(chatNum);
        return ResponseEntity.ok(data.get(0).getMemList().split(","));
    }

    @GetMapping("/chatInSelect3")
    public ResponseEntity<String> chatInSelect3(String chatNum) {
        List<ListLibraryDTO> data = listLibraryService.chatInSelect3(chatNum);
        return ResponseEntity.ok(data.get(0).getSpeaker());
    }

    @GetMapping("/chatInSelect4")
    public ResponseEntity<List<String>[]> chatInSelect4(String code) {
        List<ListLibraryDTO> data = listLibraryService.chatInSelect4(code);
        List<String>[] list =  new List[] {Arrays.asList(data.get(0).getDepCode(), data.get(0).getEmpName())};

        return ResponseEntity.ok(list);
    }

    @PostMapping("/chatInUpdate1")
    public ResponseEntity<Void> chatInUpdate1(@RequestBody Map<String, Object> data) {
        listLibraryService.chatInUpdate1(data);
        return ResponseEntity.ok().build();
    }
}
