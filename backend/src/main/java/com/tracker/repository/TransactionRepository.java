package com.tracker.repository;

import com.tracker.dto.CategoryDistributionDto;
import com.tracker.model.Transaction;
import com.tracker.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumAmountByUserIdAndType(@Param("userId") Long userId, @Param("type") TransactionType type);

    List<Transaction> findTop5ByUserIdOrderByDateDescIdDesc(Long userId);

    @Query("SELECT new com.tracker.dto.CategoryDistributionDto(t.category.name, SUM(t.amount)) " +
           "FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'EXPENSE' " +
           "GROUP BY t.category.name")
    List<CategoryDistributionDto> getCategoryDistribution(@Param("userId") Long userId);

    @Query("SELECT YEAR(t.date), MONTH(t.date), t.type, SUM(t.amount) " +
           "FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.date >= :startDate " +
           "GROUP BY YEAR(t.date), MONTH(t.date), t.type")
    List<Object[]> getMonthlySummaryRaw(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
}
