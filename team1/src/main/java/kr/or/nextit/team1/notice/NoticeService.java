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

    public List<NoticeDTO> getAllNotices() {  // 모든 공지사항 리스트로 보여줌
        return noticeMapper.getAllNotices();
    }

//    public NoticeDTO getNoticeById(int noticeNum) { // noticeNum으로 조회
//        return noticeMapper.getNoticeById(noticeNum);
//    }

    public NoticeDTO createNotice(NoticeDTO noticeDTO) { // 새 공지사항 등록
        noticeDTO.setStartDate(LocalDateTime.now()); // 작성된 날짜 현재 시간으로 설정
        noticeMapper.createNotice(noticeDTO); // 새 글 DB에 저장
        return noticeDTO;
    }

    public void updateNotice(NoticeDTO noticeDTO) { // 공지사항 업데이트
        noticeMapper.updateNotice(noticeDTO); // 업데이트한 내용 저장
    }

    public boolean deleteNotice(int noticeNum) { // 삭제
        return noticeMapper.deleteNotice(noticeNum) > 0;
        // 삭제가 되면 1이 되므로 true, 안되면 0 false
    }
}
