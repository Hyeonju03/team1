package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.CompanyDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CompanyMapper {
    void insertCompany(CompanyDTO companyDTO);

    List<CompanyDTO> selectComList(String comCode);

    void updateInfo(CompanyDTO companyDTO);

    void updateStatus(String comCode);

    int selectStatus(String comCode);

    int selectAllEmpNum(String comCode);
}
