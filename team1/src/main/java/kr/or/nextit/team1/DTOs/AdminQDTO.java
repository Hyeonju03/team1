package kr.or.nextit.team1.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminQDTO {
    private String empCode;
    private String title;
    private String content;
    private Boolean qStatus;
    private String ansTitle;
    private String ansContent;
    private int qNum;

//    public AdminQDTO(String empCode, String title, String content, Boolean qStatus) {
//        this.empCode = empCode;
//        this.title = title;
//        this.content = content;
//        this.qStatus = qStatus;
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
//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }
//
//    public String getContent() {
//        return content;
//    }
//
//    public void setContent(String content) {
//        this.content = content;
//    }
//
//    public Boolean getqStatus() {
//        return qStatus;
//    }
//
//    public void setqStatus(Boolean qStatus) {
//        this.qStatus = qStatus;
//    }
//
//    @Override
//    public String toString() {
//        return "AdminQDTO{" +
//                "empCode='" + empCode + '\'' +
//                ", title='" + title + '\'' +
//                ", content='" + content + '\'' +
//                ", qStatus=" + qStatus +
//                '}';
//    }
}
