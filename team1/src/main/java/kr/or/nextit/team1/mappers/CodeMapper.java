package kr.or.nextit.team1.mappers;

import kr.or.nextit.team1.DTOs.CodeDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CodeMapper {
   List<CodeDTO> selectCategories(String comCode); // 모든 카테고리 가져오기

   //CodeDTO selectCategories(String comCode); // 모든 카테고리 가져오기
}
