package kr.or.nextit.team1.notice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    //  공지사항을 리스트
    @GetMapping("/api/notice/list")
    public ResponseEntity<List<NoticeDTO>> noticeList() {
        List<NoticeDTO> notices = noticeService.noticeList();
        return ResponseEntity.ok(notices);
    }

    // 특정글 상세보기
    @GetMapping("/api/notice/detail/{noticeNum}")
    public ResponseEntity<NoticeDTO> getNotice(@PathVariable int noticeNum) {
        NoticeDTO notice = noticeService.getNotice(noticeNum);
        return ResponseEntity.ok(notice);
    }

    // 새로운 공지사항 생성
    @PostMapping("/api/notice/register")
    public ResponseEntity<NoticeDTO> noticeCreate(@RequestBody NoticeDTO noticeDTO) {
        NoticeDTO createdNotice = noticeService.noticeCreate(noticeDTO);
        return ResponseEntity.ok(createdNotice);
    }

    // 특정 공지사항 업데이트 처리
    @PutMapping("/api/notice/detail/{noticeNum}")
    public ResponseEntity<NoticeDTO> noticeUpdate(@PathVariable int noticeNum, @RequestBody NoticeDTO noticeDTO) {
        noticeDTO.setNoticeNum(noticeNum);
        noticeService.noticeUpdate(noticeDTO);
        return ResponseEntity.ok().build();
    }

    // 특정 공지사항 삭제처리
    @DeleteMapping("/api/notice/detail/{noticeNum}")
    public ResponseEntity<Void> noticeDelete(@PathVariable int noticeNum) {
        boolean deleted = noticeService.noticeDelete(noticeNum);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
