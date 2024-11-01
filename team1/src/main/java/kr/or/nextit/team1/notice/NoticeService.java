package kr.or.nextit.team1.notice;

import kr.or.nextit.team1.mappers.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    // 모든 사용자에게 공지사항 리스트 제공
    public List<NoticeDTO> noticeList() {
        return noticeMapper.noticeList();
    }

    // 공지사항 상세정보 제공
    public NoticeDTO getNotice(int noticeNum) {
        return noticeMapper.noticeDetail(noticeNum);
    }

    // 새 공지사항 등록 (관리자 전용)
    public NoticeDTO noticeCreate(NoticeDTO noticeDTO) {
        noticeDTO.setStartDate(LocalDateTime.now()); // 현재 시간으로 설정
        noticeMapper.noticeCreate(noticeDTO);
        return noticeDTO;
    }

    // 공지사항 업데이트 (관리자 전용)
    public void noticeUpdate(NoticeDTO noticeDTO) {
        noticeMapper.noticeUpdate(noticeDTO);
    }

    // 공지사항 삭제 (관리자 전용)
    public boolean noticeDelete(int noticeNum) {
        return noticeMapper.noticeDelete(noticeNum) > 0;
    }

    // 관리자 인증
    public boolean validateAdmin(String adminId, String adminPw) {
        Map<String, String> params = new HashMap<>();
        params.put("adminId", adminId);
        params.put("adminPw", adminPw);
        return noticeMapper.validateAdmin(params) > 0;
    }

    // 사용자 인증 (추가로 필요 시)
    public boolean validateUser(String empCode, String empPass) {
        Map<String, String> params = new HashMap<>();
        params.put("empCode", empCode);
        params.put("empPass", empPass);
        return noticeMapper.validateUser(params) > 0;
    }
}
