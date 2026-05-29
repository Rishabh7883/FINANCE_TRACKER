package com.tracker.controller;

import com.tracker.dto.ApiResponse;
import com.tracker.dto.TransactionDto;
import com.tracker.dto.TransactionRequest;
import com.tracker.model.TransactionType;
import com.tracker.security.UserPrincipal;
import com.tracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<?> createTransaction(
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            TransactionDto transactionDto = transactionService.createTransaction(request, userPrincipal);
            return ResponseEntity.status(HttpStatus.CREATED).body(transactionDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Page<TransactionDto>> getTransactions(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<TransactionDto> transactions = transactionService.getTransactions(
            userPrincipal, search, category, type, startDate, endDate, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto> getTransactionById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        TransactionDto transaction = transactionService.getTransactionById(id, userPrincipal);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            TransactionDto transactionDto = transactionService.updateTransaction(id, request, userPrincipal);
            return ResponseEntity.ok(transactionDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        transactionService.deleteTransaction(id, userPrincipal);
        return ResponseEntity.ok(new ApiResponse<>(true, "Transaction deleted successfully"));
    }
}
