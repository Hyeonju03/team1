package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.notice.NoticeDTO;
import org.apache.ibatis.annotations.Mapper;


import java.util.List;


@Mapper
public interface NoticeMapper {
    List<NoticeDTO> getAllNotices();
    NoticeDTO getNoticeById(int noticeNum);
    void createNotice(NoticeDTO noticeDTO);
    void updateNotice(NoticeDTO noticeDTO);
    int deleteNotice(int noticeNum);
}
