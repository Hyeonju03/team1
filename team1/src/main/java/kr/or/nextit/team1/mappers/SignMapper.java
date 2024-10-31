package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.SignDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Mapper
public interface SignMapper {
    List<SignDTO> signSelect(@Param("empCode") String empCode);
    void signInsert(SignDTO signDTO);
    SignDTO signDetail(int id);
    void updateSign(@Param("signNum") int signNum, @Param("target") String target, @Param("endDate") OffsetDateTime endDate);
    void updateTargetOnly(@Param("signNum") int signNum, @Param("target") String target);
    int signDelete(int id);
}
