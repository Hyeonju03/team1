package kr.or.nextit.team1;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private int id;
    private String title;
    private String category;
    private LocalDateTime date;
    private String content;
}
