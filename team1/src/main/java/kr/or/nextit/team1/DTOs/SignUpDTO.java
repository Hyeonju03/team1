package kr.or.nextit.team1.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpDTO {
    private String companyCode;
    private String empCode;
    private String empName;
    private String empPass;
    private String depCode;
    private String phoneNum;
    private String empMail;
    private String empRrn;
    private String empId;
    private String comCode;
    private String posCode;
    private String corCode;

//    public SignUpDTO() {
//    }
//
//    public SignUpDTO(String empCode) {
//        this.empCode = empCode;
//    }
//
//    public SignUpDTO(String empCode, String empName, String empPass, String depCode, String phoneNum, String empMail, String empRrn) {
//
//        this.empCode = empCode;
//        this.empName = empName;
//        this.empPass = empPass;
//        this.depCode = depCode;
//        this.phoneNum = phoneNum;
//        this.empMail = empMail;
//        this.empRrn = empRrn;
//    }
//
//    public String getEmpCode() {
//        return empCode;
//    }
//
//    public void setEmpCode(String empCode) {
//        this.empCode = empCode;
//    }
//
//    public String getEmpName() {
//        return empName;
//    }
//
//    public void setEmpName(String empName) {
//        this.empName = empName;
//    }
//
//    public String getEmpPass() {
//        return empPass;
//    }
//
//    public void setEmpPass(String empPass) {
//        this.empPass = empPass;
//    }
//
//    public String getDepCode() {
//        return depCode;
//    }
//
//    public void setDepCode(String depCode) {
//        this.depCode = depCode;
//    }
//
//    public String getPhoneNum() {
//        return phoneNum;
//    }
//
//    public void setPhoneNum(String phoneNum) {
//        this.phoneNum = phoneNum;
//    }
//
//    public String getEmpMail() {
//        return empMail;
//    }
//
//    public void setEmpMail(String empMail) {
//        this.empMail = empMail;
//    }
//
//    public String getEmpRrn() {
//        return empRrn;
//    }
//
//    public void setEmpRrn(String empRrn) {
//        this.empRrn = empRrn;
//    }
//
//    @Override
//    public String toString() {
//        return "SignUpDTO{" +
//                "empCode='" + empCode + '\'' +
//                ", empName='" + empName + '\'' +
//                ", empPass='" + empPass + '\'' +
//                ", depCode='" + depCode + '\'' +
//                ", phoneNum='" + phoneNum + '\'' +
//                ", empMail='" + empMail + '\'' +
//                ", empRrn='" + empRrn + '\'' +
//                '}';
//    }
}
