package kr.or.nextit.team1.notice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    @Autowired // NoticeService의 인스턴스 자동 주입
    private NoticeService noticeService;

    // 모든 공지사항을 가져오는 GET 요청 처리
    @GetMapping
    public List<NoticeDTO> getAllNotices() {
        return noticeService.getAllNotices(); // NoticeService에서 모든 공지사항을 가져옴
    }

    // 특정 ID로 공지사항을 가져오는 GET 요청 처리
    @GetMapping("/{id}") // ID로 조회 가능
    public ResponseEntity<NoticeDTO> getNoticeById(@PathVariable Long id) {
        NoticeDTO notice = noticeService.getNoticeById(id); // NoticeService에서 ID에 해당하는 공지사항 조회
        if (notice != null) {
            return ResponseEntity.ok(notice);
            // 공지사항이 존재하는 경우
        } else {
            return ResponseEntity.notFound().build();
            // 공지사항이 존재하지 않는 경우
            // ** 현재 구현이 필요 없는 것처럼 보일 수 있지만, 실제 애플리케이션 구동에서는 다양한 상황이 발생할 수 있다.
            // ** 만약 모든 공지사항이 항상 존재한다고 확신할 수 있다면, 그 경우에는 생략할 수 있지만, 일반적으로는 포함하는 것이 바람직하다.
        }
    }

    // 새로운 공지사항을 생성하는 POST 요청 처리
    @PostMapping
    public NoticeDTO createNotice(@RequestBody NoticeDTO noticeDTO) {
        return noticeService.createNotice(noticeDTO); // NoticeService를 통해 새로운 공지사항 생성 후 반환
    }

    // 기존 공지사항을 업데이트하는 PUT 요청 처리
    @PutMapping("/{id}") // 경로에 {id}를 포함하여 ID로 수정 가능
    public ResponseEntity<NoticeDTO> updateNotice(@PathVariable Long id, @RequestBody NoticeDTO noticeDTO) {
        NoticeDTO updatedNotice = noticeService.updateNotice(id, noticeDTO); // NoticeService를 통해 공지사항 업데이트
        if (updatedNotice != null) {
            return ResponseEntity.ok(updatedNotice);
            // 업데이트된 공지사항이 존재하는 경우
        } else {
            return ResponseEntity.notFound().build();
            // 업데이트된 공지사항이 존재하지 않는 경우
        }
    }

    // 특정 ID의 공지사항을 삭제하는 DELETE 요청 처리
    @DeleteMapping("/{id}") // 경로에 {id}를 포함하여 ID로 삭제 가능
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        boolean deleted = noticeService.deleteNotice(id); // NoticeService를 통해 공지사항 삭제 시도
        if (deleted) {
            return ResponseEntity.noContent().build();
            // 공지사항이 성공적으로 삭제된 경우
        } else {
            return ResponseEntity.notFound().build();
            // 삭제할 공지사항이 존재하지 않는 경우
        }
    }
}
