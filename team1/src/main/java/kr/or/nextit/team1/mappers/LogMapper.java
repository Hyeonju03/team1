package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.LogDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LogMapper {
    LogDTO selectLog();
    LogDTO logInsert(LogDTO logDTO);
}
