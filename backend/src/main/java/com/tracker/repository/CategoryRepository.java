package com.tracker.repository;

import com.tracker.model.Category;
import com.tracker.model.TransactionType;
import com.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Find all categories that are either system defaults (user_id is null) or created by the user
    @Query("SELECT c FROM Category c WHERE c.user.id = :userId OR c.user IS null")
    List<Category> findAllByUserIdOrSystem(@Param("userId") Long userId);
    
    // Find specific category that belongs to the user or is a system default
    @Query("SELECT c FROM Category c WHERE c.id = :id AND (c.user.id = :userId OR c.user IS null)")
    Optional<Category> findByIdAndUserIdOrSystem(@Param("id") Long id, @Param("userId") Long userId);
    
    Optional<Category> findByNameAndTypeAndUser(String name, TransactionType type, User user);
    
    Optional<Category> findByNameAndTypeAndUserIsNull(String name, TransactionType type);
    
    Boolean existsByNameAndTypeAndUserIsNull(String name, TransactionType type);
    
    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE c.name = :name AND c.type = :type AND (c.user.id = :userId OR c.user IS null)")
    Boolean existsByNameAndTypeAndUserIdOrSystem(@Param("name") String name, @Param("type") TransactionType type, @Param("userId") Long userId);
}
