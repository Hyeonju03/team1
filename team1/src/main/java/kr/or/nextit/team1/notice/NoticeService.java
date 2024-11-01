package kr.or.nextit.team1.notice;

import kr.or.nextit.team1.mappers.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;


@Service
public class NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;


    public List<NoticeDTO> noticeList() {
        return noticeMapper.noticeList(); // 모든 사용자에게 공지사항 리스트 제공
    }

    public NoticeDTO getNotice(int noticeNum) {
        return noticeMapper.noticeDetail(noticeNum); // 관리자에게만 제공
    }

    public NoticeDTO noticeCreate(NoticeDTO noticeDTO) { // 새 공지사항 등록
        // 관리자만 호출할 수 있는 메서드
        noticeDTO.setStartDate(LocalDateTime.now()); // 작성된 날짜 현재 시간으로 설정
        noticeMapper.noticeCreate(noticeDTO); // 새 글 DB에 저장
        return noticeDTO;
    }

    public void noticeUpdate(NoticeDTO noticeDTO) { // 공지사항 업데이트
        // 관리자만 호출할 수 있는 메서드
        noticeMapper.noticeUpdate(noticeDTO); // 업데이트한 내용 저장
    }

    public boolean noticeDelete(int noticeNum) { // 삭제
        // 관리자만 호출할 수 있는 메서드
        return noticeMapper.noticeDelete(noticeNum) > 0;
        // 삭제가 되면 1이 되므로 true, 안되면 0 false
    }



    public boolean validateAdmin(String adminId) {
        // adminId로 DB에서 관리자 정보를 조회하여 유효성 검사
        return noticeMapper.validateAdmin(adminId) > 0; // 관리자가 존재하면 true, 아니면 false
    }

    public boolean validateUser(String empCode) {
        return noticeMapper.validateUser(empCode) > 0; // 일반 사용자 권한
    }
}


