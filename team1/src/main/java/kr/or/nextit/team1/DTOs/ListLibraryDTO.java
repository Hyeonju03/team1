package kr.or.nextit.team1.DTOs;

public class ListLibraryDTO {
    private String depCode;
    private String upDepCode;
    private String empCode;
    private String empName;
    private String empDepCode;

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
}
