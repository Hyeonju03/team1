package kr.or.nextit.team1.DTO;

import java.time.LocalDateTime;

public class AdminFAQDTO {
    private String category;
    private String title;
    private String content;
    private LocalDateTime startDate;

    public AdminFAQDTO(String category, String title, String content, LocalDateTime startDate) {
        this.category = category;
        this.title = title;
        this.content = content;
        this.startDate = startDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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
}
