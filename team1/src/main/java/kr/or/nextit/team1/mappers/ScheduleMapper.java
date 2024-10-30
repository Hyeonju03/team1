package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.ScheduleDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleMapper {
    List<ScheduleDTO> selectSchedules(@Param("empCode") String empCode);

    void scheduleInsert(ScheduleDTO scheduleDTO);

    void updateSchedule(ScheduleDTO scheduleDTO);

    void deleteSchedule(String sNum);

    String selectAuth(String empCode);

    List<ScheduleDTO> selectDepSchedule(String empCode);

    List<ScheduleDTO> selectFullScgedule(String empCode);

}
