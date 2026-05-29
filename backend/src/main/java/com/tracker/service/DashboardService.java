package com.tracker.service;

import com.tracker.dto.*;
import com.tracker.model.Transaction;
import com.tracker.model.TransactionType;
import com.tracker.repository.TransactionRepository;
import com.tracker.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary(UserPrincipal currentUser) {
        Long userId = currentUser.getId();

        // 1. Total Income and Expenses
        BigDecimal totalIncome = transactionRepository.sumAmountByUserIdAndType(userId, TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumAmountByUserIdAndType(userId, TransactionType.EXPENSE);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        // 2. Recent Transactions (Top 5)
        List<Transaction> recentTx = transactionRepository.findTop5ByUserIdOrderByDateDescIdDesc(userId);
        List<TransactionDto> recentTxDto = recentTx.stream()
            .map(this::mapToTransactionDto)
            .collect(Collectors.toList());

        // 3. Category Distribution (Expenses Only)
        List<CategoryDistributionDto> categoryDistribution = transactionRepository.getCategoryDistribution(userId);

        // 4. Monthly Trends (Last 6 Months)
        LocalDate startDate = LocalDate.now().minusMonths(5).withDayOfMonth(1);
        List<Object[]> rawTrends = transactionRepository.getMonthlySummaryRaw(userId, startDate);

        List<MonthlyTrendDto> monthlyTrends = new ArrayList<>();
        LocalDate runner = startDate;
        LocalDate today = LocalDate.now();

        while (!runner.isAfter(today)) {
            int y = runner.getYear();
            int m = runner.getMonthValue();
            String label = runner.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + (y % 100);

            BigDecimal incomeSum = BigDecimal.ZERO;
            BigDecimal expenseSum = BigDecimal.ZERO;

            for (Object[] row : rawTrends) {
                int rowYear = ((Number) row[0]).intValue();
                int rowMonth = ((Number) row[1]).intValue();
                TransactionType type = (TransactionType) row[2];
                BigDecimal sum = (BigDecimal) row[3];

                if (rowYear == y && rowMonth == m) {
                    if (type == TransactionType.INCOME) {
                        incomeSum = sum;
                    } else if (type == TransactionType.EXPENSE) {
                        expenseSum = sum;
                    }
                }
            }

            monthlyTrends.add(new MonthlyTrendDto(label, incomeSum, expenseSum));
            runner = runner.plusMonths(1);
        }

        return new DashboardSummaryDto(
            totalIncome,
            totalExpense,
            balance,
            recentTxDto,
            categoryDistribution,
            monthlyTrends
        );
    }

    private TransactionDto mapToTransactionDto(Transaction transaction) {
        CategoryDto catDto = new CategoryDto(
            transaction.getCategory().getId(),
            transaction.getCategory().getName(),
            transaction.getCategory().getType(),
            transaction.getCategory().getUser() == null
        );

        return new TransactionDto(
            transaction.getId(),
            transaction.getTitle(),
            transaction.getDescription(),
            transaction.getAmount(),
            transaction.getType(),
            transaction.getDate(),
            catDto
        );
    }
}
