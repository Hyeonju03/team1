package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.LogDTO;
import kr.or.nextit.team1.mappers.LogMapper;
import org.springframework.stereotype.Service;

@Service
public class LogService {
    private final LogMapper logMapper;

    public LogService(LogMapper logMapper) {
        this.logMapper = logMapper;
    }

    public LogDTO selectLog() {
        return logMapper.selectLog();
    }
    public LogDTO logInsert(LogDTO logDTO) {
        return logMapper.logInsert(logDTO);
    }
}
