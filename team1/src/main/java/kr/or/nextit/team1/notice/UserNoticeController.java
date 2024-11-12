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
public class UserNoticeController {

    @Autowired
    private NoticeService noticeService;


    //  공지사항을 리스트
    @GetMapping("/api/usernotice")
    public ResponseEntity<List<NoticeDTO>> noticeList(HttpServletRequest request) {

        List<NoticeDTO> notices = noticeService.noticeList();
        return ResponseEntity.ok(notices);
    }

    // 상세보기 (모든 사용자 가능)
    @GetMapping("/api/usernotice/detail/{noticeNum}")
    public ResponseEntity<NoticeDTO> getNotice(@PathVariable int noticeNum) {
        NoticeDTO notice = noticeService.getNotice(noticeNum);
        return ResponseEntity.ok(notice);
    }

    // 일반 사용자 로그인
    @PostMapping("/api/employ/login")
    public ResponseEntity<Map<String, Object>> empCodeLogin(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        String empCode = credentials.get("empCode");
        String empPass = credentials.get("empPass"); // 비밀번호 추가

        boolean isValidUser = noticeService.validateUser(empCode, empPass);// 사용자 유효성 검사
        boolean isValidAdmin = noticeService.validateAdmin(empCode, empPass);
        System.out.println("isValidUser>>>"+isValidUser);
        System.out.println("isValidAdmin>>>"+isValidAdmin);
        if (isValidUser) {
            // 세션 생성
            HttpSession session = request.getSession();
            session.setAttribute("empCode", empCode); // 세션에 사용자 ID 저장
            session.setAttribute("role", "user");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", empCode);
            response.put("role", "user");
            return ResponseEntity.ok(response);
        } else if (isValidAdmin) {

            HttpSession session = request.getSession();
            session.setAttribute("adminId", empCode);
            session.setAttribute("role", "admin"); // 역할 저장
            // 로그인 성공 시  세션 관리 등 추가 처리
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("adminId", empCode);
            response.put("role", "admin"); // 응답에 역할 추가
            return ResponseEntity.ok(response);
        }
        else {
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
}
