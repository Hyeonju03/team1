package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.AdminQDetailDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminQDetailMapper {
    List<AdminQDetailDTO> selectAdminQDetail();

    void deleteAdminQDetail(Long id);
}
