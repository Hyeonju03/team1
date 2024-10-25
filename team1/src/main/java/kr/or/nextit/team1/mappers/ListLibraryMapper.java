package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.ListLibraryDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ListLibraryMapper {
    List<ListLibraryDTO> chartSelect(String code);
    ListLibraryDTO RClickWindowSelect(String code);
    void noticeInsert(ListLibraryDTO dto);
    List<ListLibraryDTO> noticeListSelect1(String code);
    List<ListLibraryDTO> noticeListSelect2(String code);
}