package kr.or.nextit.team1.DTOs;

import java.time.LocalDateTime;

public class AdminQDTO {
    private String empCode;
    private String title;
    private String content;

    public AdminQDTO(String empCode, String title, String content) {
        this.empCode = empCode;
        this.title = title;
        this.content = content;
    }

    public String getEmpCode() {
        return empCode;
    }

    public void setEmpCode(String empCode) {
        this.empCode = empCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "AdminQDTO{" +
                "empCode='" + empCode + '\'' +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
