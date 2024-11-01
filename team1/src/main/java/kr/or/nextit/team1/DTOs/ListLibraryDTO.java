package kr.or.nextit.team1.DTOs;

public class ListLibraryDTO {
    private String depCode;
    private String upDepCode;
    private String empCode;
    private String empName;
    private String empDepCode;
    private String  mail;
    private String  PH;
    private String  state;

    public String getDepCode() {
        return depCode;
    }

    public void setDepCode(String depCode) {
        this.depCode = depCode;
    }

    public String getUpDepCode() {
        return upDepCode;
    }

    public void setUpDepCode(String upDepCode) {
        this.upDepCode = upDepCode;
    }

    public String getEmpCode() {
        return empCode;
    }

    public void setEmpCode(String empCode) {
        this.empCode = empCode;
    }

    public String getEmpName() {
        return empName;
    }

    public void setEmpName(String empName) {
        this.empName = empName;
    }

    public String getEmpDepCode() {
        return empDepCode;
    }

    public void setEmpDepCode(String empDepCode) {
        this.empDepCode = empDepCode;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getPH() {
        return PH;
    }

    public void setPH(String PH) {
        this.PH = PH;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}