package com.tracker.service;

import com.tracker.dto.CategoryDto;
import com.tracker.dto.TransactionDto;
import com.tracker.dto.TransactionRequest;
import com.tracker.exception.ResourceNotFoundException;
import com.tracker.model.Category;
import com.tracker.model.Transaction;
import com.tracker.model.TransactionType;
import com.tracker.model.User;
import com.tracker.repository.CategoryRepository;
import com.tracker.repository.TransactionRepository;
import com.tracker.repository.UserRepository;
import com.tracker.security.UserPrincipal;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public TransactionDto createTransaction(TransactionRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Retrieve category and verify permission (system default or user custom)
        Category category = categoryRepository.findByIdAndUserIdOrSystem(request.getCategoryId(), currentUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found or access denied"));

        // Match type of transaction and category
        if (category.getType() != request.getType()) {
            throw new IllegalArgumentException("Transaction type and Category type do not match");
        }

        Transaction transaction = new Transaction(
            request.getTitle().trim(),
            request.getDescription() != null ? request.getDescription().trim() : null,
            request.getAmount(),
            request.getType(),
            request.getDate(),
            user,
            category
        );

        Transaction savedTx = transactionRepository.save(transaction);
        return mapToDto(savedTx);
    }

    @Transactional
    public TransactionDto updateTransaction(Long id, TransactionRequest request, UserPrincipal currentUser) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        // Access check
        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Transaction not found or access denied");
        }

        Category category = categoryRepository.findByIdAndUserIdOrSystem(request.getCategoryId(), currentUser.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found or access denied"));

        if (category.getType() != request.getType()) {
            throw new IllegalArgumentException("Transaction type and Category type do not match");
        }

        transaction.setTitle(request.getTitle().trim());
        transaction.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDate(request.getDate());
        transaction.setCategory(category);

        Transaction updatedTx = transactionRepository.save(transaction);
        return mapToDto(updatedTx);
    }

    @Transactional
    public void deleteTransaction(Long id, UserPrincipal currentUser) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        // Access check
        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Transaction not found or access denied");
        }

        transactionRepository.delete(transaction);
    }

    @Transactional(readOnly = true)
    public TransactionDto getTransactionById(Long id, UserPrincipal currentUser) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Transaction not found or access denied");
        }

        return mapToDto(transaction);
    }

    @Transactional(readOnly = true)
    public Page<TransactionDto> getTransactions(
            UserPrincipal currentUser,
            String search,
            String category,
            TransactionType type,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Rule 1: Must belong to current user
            predicates.add(cb.equal(root.get("user").get("id"), currentUser.getId()));

            // Rule 2: Search term (in title or description)
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("title")), searchPattern),
                    cb.like(cb.lower(root.get("description")), searchPattern)
                ));
            }

            // Rule 3: Category filter (by ID or Name)
            if (category != null && !category.trim().isEmpty()) {
                try {
                    Long categoryId = Long.parseLong(category);
                    predicates.add(cb.equal(root.get("category").get("id"), categoryId));
                } catch (NumberFormatException e) {
                    predicates.add(cb.equal(cb.lower(root.get("category").get("name")), category.trim().toLowerCase()));
                }
            }

            // Rule 4: Transaction Type (INCOME / EXPENSE)
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            // Rule 5: Date Range
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Transaction> transactionPage = transactionRepository.findAll(spec, pageable);
        return transactionPage.map(this::mapToDto);
    }

    private TransactionDto mapToDto(Transaction transaction) {
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
