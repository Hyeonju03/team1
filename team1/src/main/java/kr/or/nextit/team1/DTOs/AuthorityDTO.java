package kr.or.nextit.team1.DTOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthorityDTO {

    private String empCode;
    private String empName;
    private String depCode;
    private String posCode;
    private String notice;
    private String document;
    private String persInfo;
    private String schedule;
    private boolean permissionEdit;
    private boolean departmentManagement;
}
