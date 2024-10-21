package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.SignDTO;
import kr.or.nextit.team1.mappers.SignMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SignService {
    private final SignMapper mapper;

    @Transactional
    public List<SignDTO> selectSigns() {
        return mapper.selectSigns();
    }

//    @Transactional
//    public ScheduleDTO selectSign(int id) {
//        return mapper.selectSign(id);
//    }
//
//    @Transactional
//    public int registerSign(SignDTO sign) {
//        return mapper.registerSign(sign);
//    }
//
//    @Transactional
//    int modifySign(SignDTO sign) {
//        return mapper.modifySign(sign);
//    }
//
//    @Transactional
//    int removeSign(int id) {
//        return mapper.removeSign(id);
//    }
}
