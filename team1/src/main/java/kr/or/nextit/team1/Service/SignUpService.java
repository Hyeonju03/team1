package kr.or.nextit.team1.Service;

import kr.or.nextit.team1.DTO.SignUpDTO;
import kr.or.nextit.team1.mappers.SignUpMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SignUpService {

    private final SignUpMapper signUpMapper;

    public SignUpService(SignUpMapper signUpMapper) {
        this.signUpMapper = signUpMapper;
    }

    @Transactional
    public void registerUser(SignUpDTO signUpDTO) {
        try {
            signUpMapper.insertUserXML(signUpDTO);
        } catch (Exception e) {
            e.printStackTrace(); // 또는 로깅 프레임워크 사용
            throw e; // 예외를 다시 던져 트랜잭션 롤백
        }
    }
}
