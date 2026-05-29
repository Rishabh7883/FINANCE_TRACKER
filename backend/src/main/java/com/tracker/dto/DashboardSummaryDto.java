package com.tracker.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDto {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private List<TransactionDto> recentTransactions;
    private List<CategoryDistributionDto> categoryDistribution;
    private List<MonthlyTrendDto> monthlyTrends;

    public DashboardSummaryDto(
            BigDecimal totalIncome,
            BigDecimal totalExpense,
            BigDecimal balance,
            List<TransactionDto> recentTransactions,
            List<CategoryDistributionDto> categoryDistribution,
            List<MonthlyTrendDto> monthlyTrends) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.recentTransactions = recentTransactions;
        this.categoryDistribution = categoryDistribution;
        this.monthlyTrends = monthlyTrends;
    }

    // Getters and Setters
    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public List<TransactionDto> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionDto> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public List<CategoryDistributionDto> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(List<CategoryDistributionDto> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public List<MonthlyTrendDto> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyTrendDto> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }
}
