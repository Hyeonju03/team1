package kr.or.nextit.team1.notice;

import java.time.LocalDateTime;
import java.util.Date;

public class NoticeDTO {

    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ID를 반환하는 getter 메서드
    public Long getId() {
        return id;
    }

    // ID를 설정하는 setter 메서드
    public void setId(Long id) {
        this.id = id;
    }

    // 제목을 반환하는 getter 메서드
    public String getTitle() {
        return title;
    }

    // 제목을 설정하는 setter 메서드
    public void setTitle(String title) {
        this.title = title;
    }

    // 내용을 반환하는 getter 메서드
    public String getContent() {
        return content;
    }

    // 내용을 설정하는 setter 메서드
    public void setContent(String content) {
        this.content = content;
    }

    // 생성 날짜를 반환하는 getter 메서드
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // 생성 날짜를 설정하는 setter 메서드 (Date 타입을 LocalDateTime으로 설정)
    public void setCreatedAt(Date date) {
    }

    // 생성 날짜를 설정하는 setter 메서드 (LocalDateTime 타입)
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt; // LocalDateTime으로 생성 날짜 설정
    }

    // 수정 날짜를 반환하는 getter 메서드
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // 수정 날짜를 설정하는 setter 메서드 (LocalDateTime 타입)
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt; // LocalDateTime으로 수정 날짜 설정
    }

    // 수정 날짜를 설정하는 setter 메서드 (Date 타입을 LocalDateTime으로 설정)
    public void setUpdatedAt(Date date) {
    }
}
