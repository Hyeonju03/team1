package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.ListLibraryDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ListLibraryMapper {
    List<ListLibraryDTO> chartSelect(String code);

}
