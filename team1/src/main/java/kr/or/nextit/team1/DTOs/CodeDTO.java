package kr.or.nextit.team1.DTOs;

public class CodeDTO {
    private String depCode;

    public CodeDTO(String depCode) {
        this.depCode = depCode;
    }

    public String getDepCode() {
        return depCode;
    }

    public void setDepCode(String depCode) {
        this.depCode = depCode;
    }

    @Override
    public String toString() {
        return "CodeDTO{" +
                "depCode='" + depCode + '\'' +
                '}';
    }
}
