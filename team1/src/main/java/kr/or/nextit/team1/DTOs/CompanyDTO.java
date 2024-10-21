package kr.or.nextit.team1.DTOs;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CompanyDTO {
    private String comCode;
    private String comName;
    private String ceoName;
    private String ceoPhone;
    private String contectPhone;
    private int empNum;
    private String comEmail;
    private LocalDateTime registerDate;
    private LocalDateTime deleteDate;
    private boolean payStatus;

}