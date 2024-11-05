package kr.or.nextit.team1.Services;

import kr.or.nextit.team1.DTOs.CompanyDTO;
import kr.or.nextit.team1.mappers.CompanyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {
    private final CompanyMapper companyMapper;

    @Autowired
    public CompanyService(CompanyMapper companyMapper) {
        this.companyMapper = companyMapper;
    }

    public void insertCompany(CompanyDTO companyDTO) {
        // 매퍼를 호출하여 DB에 삽입

        companyMapper.insertCompany(companyDTO);
    }

    public List<CompanyDTO> selectComList(String comCode) {
        return companyMapper.selectComList(comCode);
    }

    public int selectAllEmpNum(String comCode) {
        return companyMapper.selectAllEmpNum(comCode);
    }

    public void updateInfo(CompanyDTO companyDTO) {
        companyMapper.updateInfo(companyDTO);
    }

    public void updateStatus(String comCode) {
        companyMapper.updateStatus(comCode);
    }

    public int selectStatus(String comCode) {
        return companyMapper.selectStatus(comCode);
    }
}
