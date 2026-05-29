package com.tracker.dto;

import com.tracker.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDto {
    private Long id;
    private String title;
    private String description;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDate date;
    private CategoryDto category;

    public TransactionDto(Long id, String title, String description, BigDecimal amount, TransactionType type, LocalDate date, CategoryDto category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public CategoryDto getCategory() {
        return category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }
}
