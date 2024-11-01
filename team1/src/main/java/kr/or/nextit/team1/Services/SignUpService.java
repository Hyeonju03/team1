package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.AuthorityDTO;
import kr.or.nextit.team1.DTOs.SignUpDTO;
import kr.or.nextit.team1.mappers.AuthorityMapper;
import kr.or.nextit.team1.mappers.SignUpMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SignUpService {

    private final SignUpMapper signUpMapper;
    private final AuthorityMapper authorityMapper;

    public SignUpService(SignUpMapper signUpMapper , AuthorityMapper authorityMapper) {
        this.signUpMapper = signUpMapper;
        this.authorityMapper = authorityMapper;
    }

    @Transactional
    public void registerUser(SignUpDTO signUpDTO) {
        try {
            //1. employee 테이블에서 회사코드로 조회시 1명이상 있는지 여부 판단(명수로 반환)

            int count = 0;
            String companyCode = (signUpDTO.getCompanyCode());
            int countEmpCodeList = signUpMapper.countEmpCode(companyCode);
            if (countEmpCodeList >= 1) {
                count++;
            }
            System.out.println(count);

            //2. employee 테이블에 insert(회원가입)
            signUpMapper.insertUserXML(signUpDTO);
            
            //3-1. 1의 count가 1이상일경우 authoritytest 테이블에 emp_cde(2에서 생성된 사원코드), per-edit(0: 수정권한없음)
            //3-2. 1의 count가 1미만일경우 authoritytest 테이블에 emp_cde(2에서 생성된 사원코드), per-edit(1: 수정권한있음)
            if (count == 0) {
                signUpMapper.insertAuthData(signUpDTO);
            }

        } catch (Exception e) {
            e.printStackTrace(); // 또는 로깅 프레임워크 사용
            throw e; // 예외를 다시 던져 트랜잭션 롤백
        }
    }
}
