package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.BusinessDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BusinessMapper {
    List<BusinessDTO> getAllBusinesses();
    BusinessDTO getBusinessByComCode(String comCode);
    void createBusiness(BusinessDTO businessDTO);
    int updateBusiness(BusinessDTO businessDTO);
    int deleteBusiness(String comCode);
}