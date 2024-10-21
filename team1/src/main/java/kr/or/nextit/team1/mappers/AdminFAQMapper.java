package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.AdminFAQDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminFAQMapper {
    List<AdminFAQDTO> selectFAQ();

}
