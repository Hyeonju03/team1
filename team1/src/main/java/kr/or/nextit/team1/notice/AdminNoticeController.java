package kr.or.nextit.team1.notice;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AdminNoticeController {

    @Autowired
    private NoticeService noticeService;


    //  공지사항을 리스트
    @GetMapping("/api/adminnotice")
    public ResponseEntity<List<NoticeDTO>> noticeList() {

        List<NoticeDTO> notices = noticeService.noticeList();
        return ResponseEntity.ok(notices);
    }

    // 상세보기 (모든 사용자 가능)
    @GetMapping("/api/adminnotice/detail/{noticeNum}")
    public ResponseEntity<NoticeDTO> getNotice(@PathVariable int noticeNum) {
        NoticeDTO notice = noticeService.getNotice(noticeNum);
        return ResponseEntity.ok(notice);
    }

    // 관리자 로그인
    @PostMapping("/api/admin/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String adminId = credentials.get("adminId");
        String adminPw = credentials.get("adminPw");
        boolean isValidAdmin = noticeService.validateAdmin(adminId, adminPw);

        if (isValidAdmin) {
            HttpSession session = request.getSession();
            session.setAttribute("adminId", adminId);
            session.setAttribute("role", "admin"); // 역할 저장
            // 로그인 성공 시  세션 관리 등 추가 처리
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("adminId", adminId);
            response.put("role", "admin"); // 응답에 역할 추가
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "유효하지 않은 관리자 ID입니다."));
        }
    }

    // 관리자 로그아웃
    @PostMapping("/api/admin/logout")
    public ResponseEntity<Map<String, Object>> adminLogout(HttpServletRequest request) {


        HttpSession session = request.getSession(false); // 현재 세션을 가져온다. (없으면 null)
        if (session != null) {
            session.invalidate(); // 세션 무효화
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "로그아웃 되었습니다."));
    }

    // 공지사항 등록 (관리자만 가능)
    @PostMapping("/api/adminnotice/register")
    public ResponseEntity<NoticeDTO> noticeCreate(@RequestBody NoticeDTO noticeDTO, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        NoticeDTO createdNotice = noticeService.noticeCreate(noticeDTO);
        return ResponseEntity.ok(createdNotice);
    }

    // 공지사항 수정 (관리자만 가능)
    @PutMapping("/api/adminnotice/detail/{noticeNum}")
    public ResponseEntity<NoticeDTO> noticeUpdate(@PathVariable int noticeNum, @RequestBody NoticeDTO noticeDTO, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        noticeDTO.setNoticeNum(noticeNum);
        noticeService.noticeUpdate(noticeDTO);
        return ResponseEntity.ok().build();
    }

    // 공지사항 삭제 (관리자만 가능)
    @DeleteMapping("/api/notice/detail/admin/{noticeNum}")
    public ResponseEntity<Void> noticeDelete(@PathVariable int noticeNum, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        boolean deleted = noticeService.noticeDelete(noticeNum);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // 관리자 권한 확인 메서드
    private boolean isAdmin(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null && "admin".equals(session.getAttribute("role"));
    }
}
