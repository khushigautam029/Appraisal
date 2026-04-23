package com.example.appraisal_system.dto;

public class DashboardResponse {

    private int totalGoals;
    private int completedGoals;
    private int pendingReviews;
    private String appraisalStatus;

    private String selfAppraisalStatus;
    private String managerReviewStatus;
    private String hrApprovalStatus;
    private String promotionStatus;

    // Getters & Setters

    public int getTotalGoals() { return totalGoals; }
    public void setTotalGoals(int totalGoals) { this.totalGoals = totalGoals; }

    public int getCompletedGoals() { return completedGoals; }
    public void setCompletedGoals(int completedGoals) { this.completedGoals = completedGoals; }

    public int getPendingReviews() { return pendingReviews; }
    public void setPendingReviews(int pendingReviews) { this.pendingReviews = pendingReviews; }

    public String getAppraisalStatus() { return appraisalStatus; }
    public void setAppraisalStatus(String appraisalStatus) { this.appraisalStatus = appraisalStatus; }

    public String getSelfAppraisalStatus() { return selfAppraisalStatus; }
    public void setSelfAppraisalStatus(String selfAppraisalStatus) { this.selfAppraisalStatus = selfAppraisalStatus; }

    public String getManagerReviewStatus() { return managerReviewStatus; }
    public void setManagerReviewStatus(String managerReviewStatus) { this.managerReviewStatus = managerReviewStatus; }

    public String getHrApprovalStatus() { return hrApprovalStatus; }
    public void setHrApprovalStatus(String hrApprovalStatus) { this.hrApprovalStatus = hrApprovalStatus; }

    public String getPromotionStatus() { return promotionStatus; }
    public void setPromotionStatus(String promotionStatus) { this.promotionStatus = promotionStatus; }
}