package kr.or.nextit.team1.DTOs;

import java.time.LocalDateTime;

//EMP_CODE,TITLE,CONTENT,START_DATE,Q_STATUS FROM adminqtest
public class AdminQDetailDTO {
    private String empCode;
    private String title;
    private String content;
    private LocalDateTime startDate;
    private Boolean QStatus;
    private int qNum;

    public AdminQDetailDTO() {

    }

    public AdminQDetailDTO(String empCode, String title, String content, LocalDateTime startDate, Boolean QStatus, int qNum) {
        this.empCode = empCode;
        this.title = title;
        this.content = content;
        this.startDate = startDate;
        this.QStatus = QStatus;
        this.qNum = qNum;
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

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public Boolean getQStatus() {
        return QStatus;
    }

    public void setQStatus(Boolean QStatus) {
        this.QStatus = QStatus;
    }

    public int getqNum() {
        return qNum;
    }

    public void setqNum(int qNum) {
        this.qNum = qNum;
    }

    @Override
    public String toString() {
        return "AdminQDetailDTO{" +
                "empCode='" + empCode + '\'' +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", startDate=" + startDate +
                ", QStatus=" + QStatus +
                ", qNum=" + qNum +
                '}';
    }
}
