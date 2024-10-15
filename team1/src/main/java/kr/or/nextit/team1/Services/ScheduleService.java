package kr.or.nextit.team1.Services;

import java.util.List;

import kr.or.nextit.team1.DTOs.ScheduleDTO;
import kr.or.nextit.team1.mappers.ScheduleMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleMapper mapper;

    @Transactional
    public List<ScheduleDTO> selectSchedules() {
        return mapper.selectSchedules();
    }

//    @Transactional
//    public ScheduleDTO selectSchedule(int id) {
//        return mapper.selectSchedule(id);
//    }
//
//    @Transactional
//    public int registerSchedule(ScheduleDTO schedule) {
//        return mapper.registerSchedule(schedule);
//    }
//
//    @Transactional
//    int modifySchedule(ScheduleDTO schedule) {
//        return mapper.modifySchedule(schedule);
//    }
//
//    @Transactional
//    int removeSchedule(int id) {
//        return mapper.removeSchedule(id);
//    }

}
