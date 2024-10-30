package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.SignDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface SignMapper {
    List<SignDTO> signSelect(@Param("empCode") String empCode);
    void signInsert(SignDTO signDTO);
    SignDTO signDetail(int id);
    void signUpdate(@Param("signNum") Long signNum, @Param("target") String target, @Param("endDate") LocalDateTime endDate);
    int signDelete(int id);
}
