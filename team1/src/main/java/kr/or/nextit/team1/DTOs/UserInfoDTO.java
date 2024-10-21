package kr.or.nextit.team1.DTOs;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserInfoDTO {
    private String empCode; // 사원코드
    private String empName; // 이름
    private String empPass; // 비밀번호
    private String depCode; // 부서코드
    private String posCode; // 직급코드
    private String phoneNum; // 전화번호
    private String extNum; // 내선번호
    private String empMail; // 메일
    private String corCode; // 상관코드
    private String empRrn; // 주민등록번호
    private String empAdd; // 주소록
    private String mailCate; // 메일카테고리
    private int notice; // 공지사항 권한
    private int document; // 문서함 권한
    private int persInfo; // 인사정보 권한
    private int schedule; // 전체일정 권한
    private String modifyReq; // 수정요청
    private String chatNum; // 대화방번호

}
