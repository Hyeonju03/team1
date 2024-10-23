package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.notice.NoticeDTO;
import org.apache.ibatis.annotations.Mapper;


import java.util.List;


@Mapper
public interface NoticeMapper {
    List<NoticeDTO> noticeList();
    NoticeDTO noticeDetail(int noticeNum);
    void noticeCreate(NoticeDTO noticeDTO);
    void noticeUpdate(NoticeDTO noticeDTO);
    int noticeDelete(int noticeNum);
}
