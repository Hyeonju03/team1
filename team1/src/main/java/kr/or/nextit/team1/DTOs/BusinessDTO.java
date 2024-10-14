package kr.or.nextit.team1.DTOs;

public class BusinessDTO {
    private String businessNumber;
    private String companyName;
    private String representativeName;
    private String representativeContact;
    private String managerContact;
    private int employeeCount;
    private String email;

    public BusinessDTO() {
    }

    public BusinessDTO(String businessNumber, String companyName, String representativeName, String representativeContact) {
        this.businessNumber = businessNumber;
        this.companyName = companyName;
        this.representativeName = representativeName;
        this.representativeContact = representativeContact;
    }

    // getter와 setter 메서드
    public String getBusinessNumber() {
        return businessNumber;
    }
    public void setBusinessNumber(String businessNumber) {
        this.businessNumber = businessNumber;
    }

    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getRepresentativeName() {
        return representativeName;
    }
    public void setRepresentativeName(String representativeName) {
        this.representativeName = representativeName;
    }

    public String getRepresentativeContact() {
        return representativeContact;
    }
    public void setRepresentativeContact(String representativeContact) {
        this.representativeContact = representativeContact;
    }

    public String getManagerContact() {
        return managerContact;
    }
    public void setManagerContact(String managerContact) {
        this.managerContact = managerContact;
    }

    public int getEmployeeCount() {
        return employeeCount;
    }
    public void setEmployeeCount(int employeeCount) {
        this.employeeCount = employeeCount;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}