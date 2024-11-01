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
public class NoticeController {

    @Autowired
    private NoticeService noticeService;


    //  공지사항을 리스트
    @GetMapping("/api/notice/list")
    public ResponseEntity<List<NoticeDTO>> noticeList(HttpServletRequest request) {

        List<NoticeDTO> notices = noticeService.noticeList();
        return ResponseEntity.ok(notices);
    }

     // 관리자 로그인 처리
    @PostMapping("/api/admin/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String adminId = credentials.get("adminId");

        boolean isValidAdmin = noticeService.validateAdmin(adminId);

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

    // 일반 사용자 로그인
    @PostMapping("/api/employ/login")
    public ResponseEntity<Map<String, Object>> empCodeLogin(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String empCode = credentials.get("empCode");

        boolean isValidUser = noticeService.validateUser(empCode); // 사용자 유효성 검사

        if (isValidUser) {
            // 세션 생성
            HttpSession session = request.getSession();
            session.setAttribute("empCode", empCode); // 세션에 사용자 ID 저장

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", empCode);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "유효하지 않은 사용자 ID 또는 비밀번호입니다."));
        }
    }

    // 일반 사용자 로그아웃
    @PostMapping("/api/employ/logout")
    public ResponseEntity<Map<String, Object>> empCodeLogout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // 세션 무효화
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "로그아웃 되었습니다."));
    }


    // 새로운 공지사항 생성 (관리자만 가능)
    @PostMapping("/api/notice/register")
    public ResponseEntity<NoticeDTO> noticeCreate(@RequestBody NoticeDTO noticeDTO, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        String adminId = "cyw";

        if(session != null) {
            adminId = (String) session.getAttribute("adminId");
        }

//        String adminId = (session != null) ? (String) session.getAttribute("adminId") : null; // 관리자 ID 가져오기

        if (adminId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // 관리자 권한이 없으면 접근 금지
        }

        NoticeDTO createdNotice = noticeService.noticeCreate(noticeDTO);
        return ResponseEntity.ok(createdNotice);
    }

    // 공지사항 수정 처리 (관리자만 가능)
    @PutMapping("/api/notice/detail/{noticeNum}")
    public ResponseEntity<NoticeDTO> noticeUpdate(@PathVariable int noticeNum, @RequestBody NoticeDTO noticeDTO, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String adminId = "cyw";

        if(session != null) {
            adminId = (String) session.getAttribute("adminId");
        }

        //String adminId = (session != null) ? (String) session.getAttribute("adminId") : null; // 관리자 ID 가져오기
        if (adminId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 관리자 권한이 없으면 접근 금지
        }

        noticeDTO.setNoticeNum(noticeNum);
        noticeService.noticeUpdate(noticeDTO);
        return ResponseEntity.ok().build();
    }


    // 상세보기 (모든 사용자 가능)
    @GetMapping("/api/notice/detail/{noticeNum}")
    public ResponseEntity<NoticeDTO> getNotice(@PathVariable int noticeNum) {
        NoticeDTO notice = noticeService.getNotice(noticeNum);
        return ResponseEntity.ok(notice);
    }

    // 공지사항 삭제처리 (관리자만 가능)
    @DeleteMapping("/api/notice/detail/admin/{noticeNum}")
    public ResponseEntity<Void> noticeDelete(@PathVariable int noticeNum, HttpServletRequest request) {
        HttpSession session = request.getSession();

        String adminId = "cyw";

        if(session != null) {
            adminId = (String) session.getAttribute("adminId");
        }

        //        String adminId = (session != null) ? (String) session.getAttribute("adminId") : null; // 관리자 ID 가져오기
        if (adminId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 관리자 권한이 없으면 접근 금지
        }

        boolean deleted = noticeService.noticeDelete(noticeNum);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
